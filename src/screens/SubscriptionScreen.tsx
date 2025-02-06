import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, Text, StyleSheet, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { apiRequest } from '../utils/api';
import { formatCurrency } from '../utils/format';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: string;
  plan: Plan;
}

interface SubscriptionResponse {
  activeSubscription: Subscription | null;
  subscriptionHistory: Subscription[];
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<Subscription[]>([]);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      if (!user) {
        router.replace('/login');
        return;
      }

      setLoading(true);
      
      const response = await apiRequest<SubscriptionResponse>('/api/mobile/subscription/details', {
        method: 'GET',
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load subscription details');
      }

      setActiveSubscription(response.data.activeSubscription);
      setSubscriptionHistory(response.data.subscriptionHistory || []);
    } catch (error: any) {
      console.error('Subscription info error:', error);
      if (error?.response?.status === 401) {
        await signOut();
        router.replace('/login');
      } else {
        Alert.alert('Error', error?.message || 'Failed to load subscription information');
      }
      setActiveSubscription(null);
      setSubscriptionHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadSubscriptionData();
  };

  const handleViewPlans = () => {
    router.push('/(modals)/plans');
  };

  const renderCurrentPlan = () => {
    return (
      <>
        <View style={[styles.card, styles.elevation]}>
          {!activeSubscription ? (
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Current Plan</Text>
              <Text style={styles.noSubscriptionText}>No active subscription</Text>
              <Text style={styles.helperText}>Subscribe to access premium features</Text>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitle}>Current Plan</Text>
              <View style={styles.cardContent}>
                <Text style={styles.planName}>{activeSubscription.plan.name}</Text>
                <Text style={styles.planDescription}>{activeSubscription.plan.description}</Text>
                <View style={styles.planDetails}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[
                    styles.statusText,
                    { color: activeSubscription.status === 'active' ? '#1DB954' : '#666' }
                  ]}>
                    {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                  </Text>
                </View>
                <View style={styles.planDetails}>
                  <Text style={styles.detailLabel}>Valid until:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(activeSubscription.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.planDetails}>
                  <Text style={styles.detailLabel}>Amount paid:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(activeSubscription.price)}</Text>
                </View>
                {activeSubscription.plan.features.length > 0 && (
                  <View style={styles.features}>
                    <Text style={styles.featuresTitle}>Features:</Text>
                    {activeSubscription.plan.features.map((feature, index) => (
                      <Text key={index} style={styles.feature}>• {feature}</Text>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.viewPlansButton}
          onPress={handleViewPlans}
          activeOpacity={0.7}
        >
          <View style={styles.viewPlansContent}>
            <Ionicons name="star-outline" size={24} color="#1DB954" />
            <View style={styles.viewPlansText}>
              <Text style={styles.viewPlansTitle}>View Premium Plans</Text>
              <Text style={styles.viewPlansDescription}>
                {activeSubscription 
                  ? 'Explore other available plans'
                  : 'Subscribe to unlock all features'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderSubscriptionHistory = () => {
    if (subscriptionHistory.length === 0) return null;

    return (
      <View style={[styles.card, styles.elevation]}>
        <Text style={styles.cardTitle}>Subscription History</Text>
        {subscriptionHistory.map(subscription => (
          <View key={subscription.id} style={styles.historyItem}>
            <Text style={styles.planName}>{subscription.plan.name}</Text>
            <View style={styles.planDetails}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.statusText,
                { color: subscription.status === 'expired' ? '#666' : '#1DB954' }
              ]}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Text>
            </View>
            <View style={styles.planDetails}>
              <Text style={styles.detailLabel}>Period:</Text>
              <Text style={styles.detailValue}>
                {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.planDetails}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>{formatCurrency(subscription.price)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Please login to view subscription information</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          colors={['#1DB954']}
        />
      }
    >
      {renderCurrentPlan()}
      {renderSubscriptionHistory()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  cardContent: {
    gap: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    marginTop: 8,
    gap: 4,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  feature: {
    fontSize: 14,
    color: '#444',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    gap: 8,
  },
  noSubscriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  viewPlansButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  viewPlansContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewPlansText: {
    flex: 1,
  },
  viewPlansTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  viewPlansDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 