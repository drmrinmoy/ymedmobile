import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, ScrollView, Platform } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useTheme } from '../../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config';

interface Drug {
  id: string;
  title: string;
  genericName: string;
  brandNames: string[];
  drugClass?: string;
}

interface DrugsListProps {
  searchQuery: string;
  onItemPress: (id: string) => void;
}

export default function DrugsList({ searchQuery, onItemPress }: DrugsListProps) {
  const { colors } = useTheme();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/api/drugs`, {
          params: { q: searchQuery }
        });
        setDrugs(response.data);
      } catch (err) {
        console.error('Error fetching drugs:', err);
        setError('Failed to load drugs');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, [searchQuery]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color="#d32f2f" />
        <Text style={[styles.errorText, { color: "#d32f2f" }]}>{error}</Text>
      </View>
    );
  }

  if (drugs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="medical" size={24} color={colors.onSurfaceVariant} />
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          No drugs found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {drugs.map((drug) => (
        <Pressable
          key={drug.id}
          style={({ pressed }) => [
            styles.card,
            { 
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
              borderColor: colors.outline,
            }
          ]}
          onPress={() => onItemPress(drug.id)}
        >
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="medical" size={22} color={colors.primary} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={[styles.cardTitle, { color: colors.onSurface }]} numberOfLines={2}>
                  {drug.title}
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  Generic: {drug.genericName}
                </Text>
              </View>
            </View>
            {drug.drugClass && (
              <Text style={[styles.cardDescription, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                Class: {drug.drugClass}
              </Text>
            )}
            {drug.brandNames && drug.brandNames.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
                contentContainerStyle={styles.tagsContent}
              >
                {drug.brandNames.map((brand, index) => (
                  <Chip
                    key={index}
                    style={[styles.tag, { backgroundColor: `${colors.primary}10` }]}
                    textStyle={{ color: colors.primary, fontSize: 12 }}
                  >
                    {brand}
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
  container: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
  },
  card: {
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
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
  cardSubtitle: {
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