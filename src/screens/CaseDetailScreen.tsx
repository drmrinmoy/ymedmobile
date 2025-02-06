import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Surface, Chip, Button, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

interface Case {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  patientInfo: {
    age: number;
    gender: string;
    chiefComplaint: string;
    history: string;
  };
  examination: string;
  diagnosis: string;
  treatment: string;
  discussion: string;
  outcome: string;
  lastUpdated: string;
  references: string[];
}

export default function CaseDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    if (!id) {
      setError('No case ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/cases/${id}`);
      setCaseData(response.data);
    } catch (error) {
      console.error('Error loading case:', error);
      setError('Failed to load case. Please try again.');
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

  if (error || !caseData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.primary }]}>{error || 'Case not found'}</Text>
        <Button mode="contained" onPress={loadCase} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
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
          
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {caseData.title}
          </Text>
          <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
            {caseData.specialty}
          </Text>
          <View style={styles.tags}>
            {caseData.tags.map((tag) => (
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

        {caseData.patientInfo && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Patient Information
              </Text>
              <View style={styles.patientInfo}>
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Age:</Text>
                <Text style={[styles.value, { color: colors.onSurface }]}>
                  {caseData.patientInfo.age} years
                </Text>
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Gender:</Text>
                <Text style={[styles.value, { color: colors.onSurface }]}>
                  {caseData.patientInfo.gender}
                </Text>
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Chief Complaint:</Text>
                <Text style={[styles.value, { color: colors.onSurface }]}>
                  {caseData.patientInfo.chiefComplaint}
                </Text>
                <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>History:</Text>
                <Text style={[styles.value, { color: colors.onSurface }]}>
                  {caseData.patientInfo.history}
                </Text>
              </View>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.examination && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Examination
              </Text>
              <Text style={[styles.contentText, { color: colors.onSurface }]}>
                {caseData.examination}
              </Text>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.diagnosis && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Diagnosis
              </Text>
              <Text style={[styles.contentText, { color: colors.onSurface }]}>
                {caseData.diagnosis}
              </Text>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.treatment && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Treatment
              </Text>
              <Text style={[styles.contentText, { color: colors.onSurface }]}>
                {caseData.treatment}
              </Text>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.discussion && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Discussion
              </Text>
              <Text style={[styles.contentText, { color: colors.onSurface }]}>
                {caseData.discussion}
              </Text>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.outcome && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Outcome
              </Text>
              <Text style={[styles.contentText, { color: colors.onSurface }]}>
                {caseData.outcome}
              </Text>
            </View>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
          </>
        )}

        {caseData.references && caseData.references.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                References
              </Text>
              {caseData.references.map((reference, index) => (
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
            Last updated: {new Date(caseData.lastUpdated).toLocaleDateString()}
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
  contentContainer: {
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  patientInfo: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  contentText: {
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