import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Chip, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DrugDetails'>;

interface Drug {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: string;
  class: string;
  description: string;
  indications: string[];
  dosage: {
    [key: string]: {
      initial: string;
      maintenance: string;
      maxDaily: string;
    };
  };
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  pregnancy: string;
  mechanism: string;
  specialty: string;
}

export default function DrugDetailsScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/drugs/${route.params.id}`);
        setDrug(response.data);
      } catch (error) {
        console.error('Error fetching drug:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrug();
  }, [route.params.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!drug) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.onSurface }]}>Drug not found</Text>
        <Pressable
          style={[styles.button, { backgroundColor: colors.surfaceVariant }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.onSurfaceVariant }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          <Text style={[styles.backText, { color: colors.onSurface }]}>Back</Text>
        </Pressable>
        
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Ionicons name="medical" size={24} color={colors.primary} />
            <Text style={[styles.title, { color: colors.onSurface }]}>{drug.name}</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {drug.genericName} • {drug.specialty}
          </Text>
        </View>
      </View>

      {/* Brand Names */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Brand Names</Text>
        <View style={styles.brandNames}>
          {drug.brandNames.map((brand, index) => (
            <Chip
              key={index}
              style={[styles.brandChip, { backgroundColor: colors.surfaceVariant }]}
              textStyle={{ color: colors.onSurfaceVariant }}
            >
              {brand}
            </Chip>
          ))}
        </View>
      </View>

      {/* Classification */}
      <View style={styles.gridSection}>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Category</Text>
          <Text style={[styles.text, { color: colors.onSurface }]}>{drug.category}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Class</Text>
          <Text style={[styles.text, { color: colors.onSurface }]}>{drug.class}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Description</Text>
        <Text style={[styles.text, { color: colors.onSurface }]}>{drug.description}</Text>
      </View>

      {/* Indications */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Indications</Text>
        {drug.indications.map((indication, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={[styles.bullet, { color: colors.onSurface }]}>•</Text>
            <Text style={[styles.text, { color: colors.onSurface }]}>{indication}</Text>
          </View>
        ))}
      </View>

      {/* Dosage */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Dosage</Text>
        {Object.entries(drug.dosage).map(([condition, doses]) => (
          <View key={condition} style={[styles.dosageCard, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.dosageTitle, { color: colors.onSurface }]}>
              {condition.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <View style={styles.dosageGrid}>
              <View style={styles.dosageItem}>
                <Text style={[styles.dosageLabel, { color: colors.onSurfaceVariant }]}>Initial</Text>
                <Text style={[styles.text, { color: colors.onSurface }]}>{doses.initial}</Text>
              </View>
              <View style={styles.dosageItem}>
                <Text style={[styles.dosageLabel, { color: colors.onSurfaceVariant }]}>Maintenance</Text>
                <Text style={[styles.text, { color: colors.onSurface }]}>{doses.maintenance}</Text>
              </View>
              <View style={styles.dosageItem}>
                <Text style={[styles.dosageLabel, { color: colors.onSurfaceVariant }]}>Max Daily</Text>
                <Text style={[styles.text, { color: colors.onSurface }]}>{doses.maxDaily}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Safety Information */}
      <View style={styles.gridSection}>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>Contraindications</Text>
          {drug.contraindications.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.onSurface }]}>•</Text>
              <Text style={[styles.text, { color: colors.onSurface }]}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: '#CA8A04' }]}>Side Effects</Text>
          {drug.sideEffects.map((effect, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.onSurface }]}>•</Text>
              <Text style={[styles.text, { color: colors.onSurface }]}>{effect}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Interactions and Pregnancy */}
      <View style={styles.gridSection}>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Drug Interactions</Text>
          {drug.interactions.map((interaction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.onSurface }]}>•</Text>
              <Text style={[styles.text, { color: colors.onSurface }]}>{interaction}</Text>
            </View>
          ))}
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Pregnancy Category</Text>
          <Text style={[styles.text, { color: colors.onSurface }]}>{drug.pregnancy}</Text>
        </View>
      </View>

      {/* Mechanism of Action */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Mechanism of Action</Text>
        <Text style={[styles.text, { color: colors.onSurface }]}>{drug.mechanism}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  header: {
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  brandNames: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandChip: {
    height: 32,
  },
  gridSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
  },
  dosageCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dosageTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  dosageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dosageItem: {
    flex: 1,
  },
  dosageLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
}); 