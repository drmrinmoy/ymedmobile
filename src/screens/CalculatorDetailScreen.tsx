import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Surface, Chip, Button, Divider, TextInput } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

interface Calculator {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  inputs: Array<{
    id: string;
    label: string;
    type: 'number' | 'select';
    options?: Array<{ value: string; label: string }>;
    unit?: string;
  }>;
  formula: string;
  interpretation: string;
  references: string[];
  lastUpdated: string;
}

export default function CalculatorDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalculator();
  }, [id]);

  const loadCalculator = async () => {
    if (!id) {
      setError('No calculator ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/calculators/${id}`);
      setCalculator(response.data);
      // Initialize inputs with null check
      const initialInputs = (response.data.inputs || []).reduce((acc: Record<string, string>, input: { id: string }) => {
        acc[input.id] = '';
        return acc;
      }, {});
      setInputs(initialInputs);
    } catch (error) {
      console.error('Error loading calculator:', error);
      setError('Failed to load calculator. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!id) return;
    
    setCalculating(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/calculators/${id}/calculate`, {
        inputs
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error calculating:', error);
      setError('Failed to calculate. Please check your inputs and try again.');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (error || !calculator) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.primary }]}>{error || 'Calculator not found'}</Text>
        <Button mode="contained" onPress={loadCalculator} style={styles.retryButton}>
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
            {calculator.title}
          </Text>
          {calculator.specialty && (
            <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
              {calculator.specialty}
            </Text>
          )}
          {calculator.tags && Array.isArray(calculator.tags) && calculator.tags.length > 0 && (
            <View style={styles.tags}>
              {calculator.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                  textStyle={{ color: colors.onSurfaceVariant }}
                >
                  {tag.name}
                </Chip>
              ))}
            </View>
          )}
        </View>

        <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Description
          </Text>
          <Text style={[styles.contentText, { color: colors.onSurfaceVariant }]}>
            {calculator.description}
          </Text>
        </View>

        <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Calculator
          </Text>
          {calculator.inputs && Array.isArray(calculator.inputs) && calculator.inputs.length > 0 && calculator.inputs.map((input) => (
            <View key={input.id} style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.onSurface }]}>
                {input.label} {input.unit ? `(${input.unit})` : ''}
              </Text>
              <TextInput
                value={inputs[input.id] || ''}
                onChangeText={(value) => setInputs({ ...inputs, [input.id]: value })}
                mode="outlined"
                keyboardType={input.type === 'number' ? 'numeric' : 'default'}
                style={styles.input}
                outlineColor={colors.surfaceVariant}
                textColor={colors.onSurface}
              />
            </View>
          ))}
          <Button 
            mode="contained" 
            onPress={handleCalculate}
            loading={calculating}
            disabled={calculating || Object.values(inputs).some(value => !value)}
            style={styles.calculateButton}
          >
            Calculate
          </Button>
          {result && (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultLabel, { color: colors.onSurface }]}>
                Result:
              </Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>
                {result}
              </Text>
            </View>
          )}
        </View>

        <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
            Interpretation
          </Text>
          <Text style={[styles.contentText, { color: colors.onSurface }]}>
            {calculator.interpretation}
          </Text>
        </View>

        {calculator.references && Array.isArray(calculator.references) && calculator.references.length > 0 && (
          <>
            <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                References
              </Text>
              {calculator.references.map((reference, index) => (
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
            Last updated: {new Date(calculator.lastUpdated).toLocaleDateString()}
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
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  calculateButton: {
    marginTop: 16,
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
}); 