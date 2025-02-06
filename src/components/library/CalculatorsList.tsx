import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Text, Chip, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../config';

interface Calculator {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
}

interface CalculatorsListProps {
  searchQuery: string;
  onItemPress: (id: string) => void;
}

export default function CalculatorsList({ searchQuery, onItemPress }: CalculatorsListProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalculators();
  }, []);

  const loadCalculators = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/calculators`);
      setCalculators(response.data || []);
    } catch (error) {
      console.error('Error loading calculators:', error);
      setError('Failed to load calculators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCalculators = calculators.filter(calculator => 
    calculator?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calculator?.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calculator?.tags?.some(tag => tag?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCalculatorPress = (calculator: Calculator) => {
    try {
      router.push(`calculators/${calculator.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons 
          name="alert-circle-outline" 
          size={48} 
          color={colors.primary} 
        />
        <Text style={[styles.error, { color: colors.primary }]}>{error}</Text>
      </View>
    );
  }

  if (filteredCalculators.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons 
          name="calculator-outline" 
          size={48} 
          color={colors.onSurfaceVariant} 
        />
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          No calculators found
        </Text>
      </View>
    );
  }

  return (
    <View>
      {filteredCalculators.map((calculator) => (
        <Pressable
          key={calculator.id}
          onPress={() => handleCalculatorPress(calculator)}
          style={({ pressed }) => [
            styles.card,
            { 
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
              borderColor: colors.outline,
            }
          ]}
        >
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons 
                  name="calculator" 
                  size={22} 
                  color={colors.primary}
                />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text 
                  style={[styles.cardTitle, { color: colors.onSurface }]}
                  numberOfLines={2}
                >
                  {calculator.title}
                </Text>
                <Text 
                  style={[styles.cardSpecialty, { color: colors.onSurfaceVariant }]}
                  numberOfLines={1}
                >
                  {calculator.specialty}
                </Text>
              </View>
            </View>
            {calculator.description && (
              <Text 
                style={[styles.cardDescription, { color: colors.onSurfaceVariant }]}
                numberOfLines={2}
              >
                {calculator.description}
              </Text>
            )}
            {calculator.tags && calculator.tags.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
                contentContainerStyle={styles.tagsContent}
              >
                {calculator.tags.map((tag, index) => (
                  <Chip
                    key={tag?.id || index}
                    style={[styles.tag, { backgroundColor: `${colors.primary}10` }]}
                    textStyle={{ color: colors.primary, fontSize: 12 }}
                  >
                    {tag?.name}
                  </Chip>
                ))}
              </ScrollView>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    gap: 12,
  },
  error: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardInner: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSpecialty: {
    fontSize: 14,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    marginTop: 8,
    marginLeft: -4,
  },
  tagsContent: {
    paddingRight: 8,
  },
  tag: {
    marginHorizontal: 4,
    height: 26,
    borderRadius: 8,
  },
}); 