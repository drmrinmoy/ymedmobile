import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { API_URL } from '../config';
import MarkdownDisplay from 'react-native-markdown-display';

type Props = NativeStackScreenProps<RootStackParamList, 'Cases'>;

interface Case {
  id: string;
  title: string;
  content: string;
  specialty: string;
  diagnosis: string;
  treatment: string;
}

export default function CaseScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!route.params?.id) return;
    loadCase();
  }, [route.params?.id]);

  const loadCase = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cases/${route.params.id}`);
      setCaseData(response.data);
    } catch (error) {
      console.error('Error loading case:', error);
      setError('Failed to load case');
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

  if (error || !caseData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.onSurfaceVariant }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={colors.onSurface}
        />
        <Text style={[styles.title, { color: colors.onSurface }]}>
          {caseData.title}
        </Text>
        <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
          {caseData.specialty}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Case Presentation
          </Text>
          <MarkdownDisplay style={{ body: { color: colors.onSurface } }}>
            {caseData.content}
          </MarkdownDisplay>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Diagnosis
          </Text>
          <MarkdownDisplay style={{ body: { color: colors.onSurface } }}>
            {caseData.diagnosis}
          </MarkdownDisplay>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Treatment
          </Text>
          <MarkdownDisplay style={{ body: { color: colors.onSurface } }}>
            {caseData.treatment}
          </MarkdownDisplay>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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