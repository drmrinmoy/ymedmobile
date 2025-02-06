import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Surface, Chip, Button, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

interface Guideline {
  id: string;
  title: string;
  description: string;
  content: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  lastUpdated: string;
  references: string[];
}

export default function GuidelineDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGuideline();
  }, [id]);

  const loadGuideline = async () => {
    if (!id) {
      setError('No guideline ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/guidelines/${id}`);
      setGuideline(response.data);
    } catch (error) {
      console.error('Error loading guideline:', error);
      setError('Failed to load guideline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (error || !guideline) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.primary }]}>{error || 'Guideline not found'}</Text>
        <Button mode="contained" onPress={loadGuideline} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
            <Text style={[styles.backText, { color: colors.onSurface }]}>Back</Text>
          </Pressable>
          
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="book" size={24} color={colors.primary} />
              <Text style={[styles.title, { color: colors.onSurface }]}>{guideline.title}</Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              {guideline.specialty}
            </Text>
          </View>
          <View style={styles.tags}>
            {guideline.tags.map((tag) => (
              <Chip
                key={tag.id}
                style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                textStyle={{ color: colors.onSurfaceVariant }}
              >
                {tag.name}
              </Chip>
            ))}
          </View>
        </View>

        <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            {guideline.description}
          </Text>
        </View>

        <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Content
          </Text>
          <Text style={[styles.content, { color: colors.onSurface }]}>
            {guideline.content}
          </Text>
        </View>

        {guideline.references.length > 0 && (
          <>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                References
              </Text>
              {guideline.references.map((reference, index) => (
                <Text 
                  key={index} 
                  style={[styles.reference, { color: colors.onSurfaceVariant }]}
                >
                  {index + 1}. {reference}
                </Text>
              ))}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={[styles.lastUpdated, { color: colors.onSurfaceVariant }]}>
            Last updated: {new Date(guideline.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
  },
  titleContainer: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    height: 32,
  },
  divider: {
    height: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  lastUpdated: {
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
}); 