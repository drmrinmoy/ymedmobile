import React from 'react';
import { ScrollView, View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList } from '../types/navigation';

type Props = NativeStackScreenProps<TabParamList, 'Home'>;

const features = [
  {
    key: 'Guidelines',
    tab: 'Library',
    icon: 'book-outline',
    color: '#3B82F6',
    description: 'Evidence-based clinical guidelines for better patient care',
    details: 'Access comprehensive medical guidelines across specialties'
  },
  {
    key: 'Cases',
    tab: 'Library',
    icon: 'document-text-outline',
    color: '#8B5CF6',
    description: 'Real clinical case studies to enhance your knowledge',
    details: 'Learn from real-world medical scenarios and experiences'
  },
  {
    key: 'Calculators',
    tab: 'Library',
    icon: 'calculator-outline',
    color: '#10B981',
    description: 'Medical calculators and clinical scoring tools',
    details: 'Quick access to essential medical calculations and risk scores'
  },
  {
    key: 'Quizzes',
    tab: 'Library',
    icon: 'help-circle-outline',
    color: '#F59E0B',
    description: 'Test and improve your medical knowledge',
    details: 'Practice questions to strengthen your clinical understanding'
  },
];

const { width } = Dimensions.get('window');
const cardWidth = width > 768 ? (width - 48) / 2 : width - 32;

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const handleFeaturePress = (feature: typeof features[0]) => {
    navigation.navigate('Library', { activeTab: feature.key });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Section */}
      <View style={styles.hero}>
        
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, { color: colors.onSurface }]}>
            YMed
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.onSurfaceVariant }]}>
            Your Pocket Medical Reference
          </Text>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        {features.map((feature) => (
          <Pressable
            key={feature.key}
            style={[styles.card, { 
              backgroundColor: colors.surface,
              width: cardWidth 
            }]}
            onPress={() => handleFeaturePress(feature)}
          >
            <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
              {feature.key}
            </Text>
            <Text style={[styles.cardDescription, { color: colors.onSurfaceVariant }]}>
              {feature.description}
            </Text>
            <Text style={[styles.cardDetails, { color: colors.onSurfaceVariant }]}>
              {feature.details}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <Text style={[styles.ctaTitle, { color: colors.onSurface }]}>
          Ready to enhance your medical practice?
        </Text>
        <Text style={[styles.ctaText, { color: colors.onSurfaceVariant }]}>
          Start exploring our comprehensive medical resources today.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    padding: 24,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardDetails: {
    fontSize: 12,
  },
  cta: {
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 