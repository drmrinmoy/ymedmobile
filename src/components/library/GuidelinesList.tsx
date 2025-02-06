import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, Chip, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../config';

interface Guideline {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
}

interface GuidelinesListProps {
  searchQuery: string;
  onItemPress: (id: string) => void;
}

export default function GuidelinesList({ searchQuery, onItemPress }: GuidelinesListProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGuidelines();
  }, []);

  const loadGuidelines = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/guidelines`);
      setGuidelines(response.data || []);
    } catch (error) {
      console.error('Error loading guidelines:', error);
      setError('Failed to load guidelines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuidelines = guidelines.filter(guideline => 
    guideline?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline?.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guideline?.tags?.some(tag => tag?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleGuidelinePress = (guideline: Guideline) => {
    try {
      router.push(`guidelines/${guideline.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.error, { color: colors.primary }]}>{error}</Text>
      </View>
    );
  }

  if (filteredGuidelines.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons 
          name="document-text-outline" 
          size={48} 
          color={colors.onSurfaceVariant} 
        />
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          No guidelines found
        </Text>
      </View>
    );
  }

  return (
    <View>
      {filteredGuidelines.map((guideline) => (
        <Pressable
          key={guideline.id}
          onPress={() => handleGuidelinePress(guideline)}
          style={({ pressed }) => [
            styles.card,
            { 
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1
            }
          ]}
        >
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.primary }]}>
                <Ionicons 
                  name="document-text" 
                  size={24} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text 
                  style={[styles.cardTitle, { color: colors.onSurface }]}
                  numberOfLines={2}
                >
                  {guideline.title}
                </Text>
                <Text 
                  style={[styles.cardSpecialty, { color: colors.onSurfaceVariant }]}
                  numberOfLines={1}
                >
                  {guideline.specialty}
                </Text>
              </View>
            </View>
            {guideline.description && (
              <Text 
                style={[styles.cardDescription, { color: colors.onSurfaceVariant }]}
                numberOfLines={2}
              >
                {guideline.description}
              </Text>
            )}
            {guideline.tags && guideline.tags.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
                contentContainerStyle={styles.tagsContent}
              >
                {guideline.tags.map((tag, index) => (
                  <Chip
                    key={tag?.id || index}
                    style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                    textStyle={{ color: colors.onSurfaceVariant }}
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
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  cardInner: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingRight: 12,
  },
  tag: {
    marginHorizontal: 4,
    height: 28,
  },
}); 