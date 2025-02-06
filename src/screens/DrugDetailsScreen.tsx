import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Chip, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';

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

export default function DrugDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/drugs/${id}`);
        setDrug(response.data);
      } catch (error) {
        console.error('Error fetching drug:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrug();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Drug Details" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!drug) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Drug Details" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.onSurface }]}>Drug not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={drug.name} showBack />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="medical" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            {drug.genericName} • {drug.specialty}
          </Text>
        </View>

        {/* Brand Names */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Brand Names</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandNames}
          >
            {drug.brandNames.map((brand, index) => (
              <Chip
                key={index}
                style={[styles.brandChip, { backgroundColor: `${colors.primary}10` }]}
                textStyle={{ color: colors.primary }}
              >
                {brand}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Classification */}
        <View style={styles.gridSection}>
          <View style={[styles.gridItem, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>Category</Text>
            <Text style={[styles.gridValue, { color: colors.onSurface }]}>{drug.category}</Text>
          </View>
          <View style={[styles.gridItem, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>Class</Text>
            <Text style={[styles.gridValue, { color: colors.onSurface }]}>{drug.class}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
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
    gap: 8,
  },
  errorText: {
    fontSize: 15,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  brandNames: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  brandChip: {
    borderRadius: 8,
  },
  gridSection: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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