import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Chip, IconButton, TextInput, Button } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { API_URL } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Calculators'>;

interface Field {
  id: string;
  label: string;
  type: 'number' | 'select';
  options?: Array<{ value: string; label: string }>;
  unit?: string;
  required: boolean;
}

interface Calculator {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  fields: Field[];
  interpretation: string;
  formula: string;
  references: string[];
}

interface FormData {
  [key: string]: string | number;
}

export default function CalculatorScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalculator();
  }, [route.params?.id]);

  const loadCalculator = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/calculators/${route.params?.id}`);
      setCalculator(response.data);
      // Initialize form data with empty values
      const initialData: FormData = {};
      response.data.fields.forEach((field: Field) => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error loading calculator:', error);
      setError('Failed to load calculator');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/calculators/${route.params?.id}/calculate`, formData);
      setResult(response.data.result);
    } catch (error) {
      console.error('Calculation error:', error);
      setError('Failed to calculate result');
    } finally {
      setCalculating(false);
    }
  };

  const renderField = (field: Field) => (
    <View key={field.id} style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
        {field.label} {field.required && <Text style={{ color: colors.primary }}>*</Text>}
      </Text>
      {field.type === 'select' ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.optionsContainer}
        >
          {field.options?.map(option => (
            <Chip
              key={option.value}
              selected={formData[field.id] === option.value}
              onPress={() => setFormData(prev => ({ ...prev, [field.id]: option.value }))}
              style={[
                styles.optionChip,
                { 
                  backgroundColor: formData[field.id] === option.value 
                    ? colors.primary 
                    : colors.surfaceVariant 
                }
              ]}
              textStyle={{ 
                color: formData[field.id] === option.value 
                  ? colors.surface 
                  : colors.onSurfaceVariant 
              }}
            >
              {option.label}
            </Chip>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          value={formData[field.id].toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, [field.id]: text }))}
          keyboardType="numeric"
          mode="outlined"
          right={field.unit ? <TextInput.Affix text={field.unit} /> : null}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          outlineColor={colors.outline}
          activeOutlineColor={colors.primary}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (error || !calculator) {
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
            {calculator.title}
          </Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            {calculator.description}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tags}
          >
            {calculator.tags.map((tag) => (
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
        <View style={styles.form}>
          {calculator.fields.map(renderField)}
        </View>

        <Button
          mode="contained"
          onPress={handleCalculate}
          loading={calculating}
          style={styles.calculateButton}
          disabled={calculating}
        >
          Calculate
        </Button>

        {result && (
          <View style={[styles.resultSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
              Result
            </Text>
            <Text style={[styles.resultValue, { color: colors.primary }]}>
              {result}
            </Text>
            <Text style={[styles.interpretation, { color: colors.onSurfaceVariant }]}>
              {calculator.interpretation}
            </Text>
          </View>
        )}

        <View style={[styles.formulaSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formulaTitle, { color: colors.onSurface }]}>
            Formula
          </Text>
          <Text style={[styles.formula, { color: colors.onSurfaceVariant }]}>
            {calculator.formula}
          </Text>
        </View>

        {calculator.references.length > 0 && (
          <View style={styles.references}>
            <Text style={[styles.referencesTitle, { color: colors.onSurface }]}>
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
  description: {
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
  form: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  optionsContainer: {
    flexGrow: 0,
    marginBottom: 8,
  },
  optionChip: {
    marginRight: 8,
  },
  calculateButton: {
    marginBottom: 24,
  },
  resultSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  interpretation: {
    fontSize: 14,
    lineHeight: 20,
  },
  formulaSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  formulaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formula: {
    fontSize: 14,
    lineHeight: 20,
  },
  references: {
    marginTop: 8,
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