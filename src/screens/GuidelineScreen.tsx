import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Chip, IconButton } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { API_URL } from '../config';
import MarkdownDisplay from 'react-native-markdown-display';

type Props = NativeStackScreenProps<RootStackParamList, 'Guidelines'>;

interface Guideline {
  id: string;
  title: string;
  content: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  references: string[];
}

export default function GuidelineScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGuideline();
  }, [route.params?.id]);

  const loadGuideline = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/guidelines/${route.params?.id}`);
      setGuideline(response.data);
    } catch (error) {
      console.error('Error loading guideline:', error);
      setError('Failed to load guideline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (error || !guideline) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.onSurfaceVariant }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <IconButton
            icon="arrow-back"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={colors.onSurface}
          />
          <IconButton
            icon="bookmark-outline"
            size={24}
            onPress={() => {}}
            iconColor={colors.onSurface}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {guideline.title}
          </Text>
          <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
            {guideline.specialty}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tags}
          >
            {guideline.tags.map((tag) => (
              <Chip
                key={tag.id}
                style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                textStyle={{ color: colors.onSurfaceVariant }}
              >
                {tag.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <MarkdownDisplay
          style={{
            body: { color: colors.onSurface },
            heading1: { color: colors.onSurface, marginVertical: 16 },
            heading2: { color: colors.onSurface, marginVertical: 12 },
            heading3: { color: colors.onSurface, marginVertical: 8 },
            paragraph: { color: colors.onSurface, marginVertical: 8 },
            link: { color: colors.primary },
            list_item: { color: colors.onSurface },
            bullet_list: { color: colors.onSurface },
            ordered_list: { color: colors.onSurface },
            code_block: { 
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurfaceVariant,
              padding: 16,
              borderRadius: 8,
            },
          }}
        >
          {guideline.content}
        </MarkdownDisplay>

        {guideline.references.length > 0 && (
          <View style={styles.references}>
            <Text style={[styles.referencesTitle, { color: colors.onSurface }]}>
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    marginBottom: 16,
  },
  tags: {
    flexGrow: 0,
    marginBottom: 8,
  },
  tag: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  references: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  referencesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reference: {
    fontSize: 14,
    marginBottom: 8,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    padding: 16,
    textAlign: 'center',
  },
}); 