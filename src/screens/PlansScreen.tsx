import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
  basePrice: number;
  pricing: {
    SIX_MONTHS: number;
    ONE_YEAR: number;
    TWO_YEARS: number;
    FIVE_YEARS: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface PlansData {
  plans: Plan[];
}

type Duration = 'SIX_MONTHS' | 'ONE_YEAR' | 'TWO_YEARS' | 'FIVE_YEARS';

export default function PlansScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Duration>('ONE_YEAR');

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      if (!user) {
        router.replace('/login');
        return;
      }

      setLoading(true);
      
      const response = await apiRequest<ApiResponse<PlansData>>('/api/mobile/subscription/plans', {
        method: 'GET',
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load plans');
      }

      setPlans(response.data.data.plans);
      if (response.data.data.plans.length > 0) {
        setSelectedPlan(response.data.data.plans[0]);
      }
    } catch (error: any) {
      console.error('Plans fetch error:', error);
      if (error?.response?.status === 401) {
        await signOut();
        router.replace('/login');
      } else {
        Alert.alert('Error', error?.message || 'Failed to load plans');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      router.push({
        pathname: '/payment',
        params: {
          planId: selectedPlan.id,
          duration: selectedDuration,
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to proceed to payment');
    }
  };

  const renderDurationSelector = () => {
    const durations: Duration[] = ['SIX_MONTHS', 'ONE_YEAR', 'TWO_YEARS', 'FIVE_YEARS'];
    const discounts = {
      'SIX_MONTHS': '0%',
      'ONE_YEAR': '10%',
      'TWO_YEARS': '20%',
      'FIVE_YEARS': '30%'
    };

    return (
      <View style={styles.durationSelector}>
        {durations.map(duration => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              selectedDuration === duration ? styles.selectedDurationButton : styles.outlinedDurationButton
            ]}
            onPress={() => setSelectedDuration(duration)}
            activeOpacity={0.7}
          >
            <Text style={selectedDuration === duration ? styles.selectedDurationText : styles.durationText}>
              {duration.replace('_', ' ').toLowerCase()}
              {'\n'}
              {discounts[duration]} off
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPlans = () => {
    return plans.map(plan => (
      <TouchableOpacity 
        key={plan.id}
        style={[
          styles.planCard,
          selectedPlan?.id === plan.id && styles.selectedPlanCard
        ]}
        onPress={() => setSelectedPlan(plan)}
        activeOpacity={0.7}
      >
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
        <Text style={styles.price}>
          {formatCurrency(plan.pricing[selectedDuration])} / {selectedDuration.toLowerCase().replace('_', ' ')}
        </Text>
        <View style={styles.features}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
              <Text style={styles.feature}>{feature}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    ));
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
        <Text style={styles.errorText}>Please login to view plans</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Select a plan that works best for you</Text>
        
        {renderDurationSelector()}
        {renderPlans()}
      </ScrollView>

      {selectedPlan && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            activeOpacity={0.7}
          >
            <Text style={styles.subscribeButtonText}>Continue to Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  durationSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  durationButton: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDurationButton: {
    backgroundColor: '#1DB954',
  },
  outlinedDurationButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  selectedDurationText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  durationText: {
    color: '#1DB954',
    fontWeight: '600',
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1DB954',
    marginBottom: 16,
  },
  features: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feature: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  subscribeButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
}); 