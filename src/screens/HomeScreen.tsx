import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform, Pressable } from 'react-native';
import { Text, Surface, SegmentedButtons } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LastContent {
  id: string;
  title: string;
  specialty: string;
  type: 'guideline' | 'case' | 'calculator' | 'quiz';
}

const features = [
  {
    title: 'Guidelines',
    description: 'Evidence-based medical guidelines',
    icon: 'document-text',
    color: '#1a73e8',
    href: '/library?section=guidelines',
  },
  {
    title: 'Cases',
    description: 'Clinical case studies',
    icon: 'flask',
    color: '#d93025',
    href: '/library?section=cases',
  },
  {
    title: 'Calculators',
    description: 'Medical calculators & tools',
    icon: 'calculator',
    color: '#188038',
    href: '/library?section=calculators',
  },
  {
    title: 'Quizzes',
    description: 'Test your knowledge',
    icon: 'school',
    color: '#9334e9',
    href: '/library?section=quizzes',
  },
  {
    title: 'Bookmarks',
    description: 'Your saved content',
    icon: 'bookmark',
    color: '#f9a825',
    href: '/bookmarks',
  },
  {
    title: 'Search',
    description: 'Find anything quickly',
    icon: 'search',
    color: '#4a5568',
    href: '/search',
  },
];

type LibrarySection = 'guidelines' | 'cases' | 'calculators' | 'quizzes';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [lastContent, setLastContent] = useState<LastContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<LibrarySection>('guidelines');

  useEffect(() => {
    loadLastContent();
  }, []);

  const loadLastContent = async () => {
    try {
      const stored = await AsyncStorage.getItem('lastContent');
      if (stored) {
        setLastContent(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading last content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (value: string) => {
    setSection(value as LibrarySection);
    router.push(`/library?section=${value}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Surface 
          style={[styles.heroSection]}
          elevation={2}
        >
          <View style={[styles.heroSection, { overflow: 'hidden' }]}>
            <View 
              style={[
                styles.heroGradient,
                { 
                  backgroundColor: colors.primary,
                  opacity: 0.95,
                }
              ]} 
            />
            <View 
              style={[
                styles.heroPattern,
                { 
                  backgroundColor: colors.primary,
                  opacity: 0.1,
                }
              ]} 
            />
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Ionicons name="heart" size={24} color="#fff" />
              </View>
              <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>
                Welcome to YMed
              </Text>
              <Text style={[styles.heroSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
                Your comprehensive medical reference and learning platform
              </Text>
              <Pressable
                onPress={() => router.push('/search')}
                style={({ pressed }) => [
                  styles.heroButton,
                  { 
                    backgroundColor: '#ffffff',
                    opacity: pressed ? 0.9 : 1,
                  }
                ]}
              >
                <Text style={[styles.heroButtonText, { color: colors.primary }]}>
                  Start Exploring
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} style={styles.heroButtonIcon} />
              </Pressable>
            </View>
          </View>
        </Surface>

        {/* AI Assistant Banner */}
        <Pressable
          onPress={() => router.push('(tabs)/ai')}
          style={({ pressed }) => [
            styles.aiBanner,
            { 
              backgroundColor: colors.surface,
              borderColor: colors.outline,
              opacity: pressed ? 0.7 : 1,
            }
          ]}
        >
          <View style={styles.aiIconContainer}>
            <View style={[styles.aiIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="medical" size={22} color={colors.primary} />
            </View>
          </View>
          <View style={styles.aiBannerContent}>
            <Text style={[styles.aiBannerTitle, { color: colors.onSurface }]}>
              AI Medical Assistant
            </Text>
            <Text style={[styles.aiBannerSubtitle, { color: colors.onSurfaceVariant }]}>
              Get instant answers to your medical questions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />
        </Pressable>

        {/* Quick Actions Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Pressable
              key={feature.href}
              onPress={() => {
                const section = feature.href.split('=')[1];
                if (section === 'guidelines' || section === 'cases' || 
                    section === 'calculators' || section === 'quizzes') {
                  setSection(section as LibrarySection);
                }
                router.push(feature.href);
              }}
              style={({ pressed }) => [
                styles.featureCard,
                { 
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                  borderColor: colors.outline,
                }
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                <Ionicons name={feature.icon as any} size={22} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.onSurface }]} numberOfLines={1}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                {feature.description}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Continue Learning */}
        {!loading && lastContent && (
          <Surface 
            style={[styles.lastContentCard]}
            elevation={1}
          >
            <View style={[styles.lastContentCard, { backgroundColor: colors.surface }]}>
              <View style={styles.lastContentHeader}>
                <View style={styles.lastContentHeaderLeft}>
                  <Ionicons name="time-outline" size={20} color={colors.onSurfaceVariant} />
                  <Text style={[styles.lastContentTitle, { color: colors.onSurface }]}>
                    Continue Learning
                  </Text>
                </View>
                <Ionicons name="trending-up" size={20} color={colors.onSurfaceVariant} />
              </View>
              <Pressable
                onPress={() => router.push(`/${lastContent.type}s/${lastContent.id}`)}
                style={({ pressed }) => [
                  styles.lastContentButton,
                  { 
                    backgroundColor: `${colors.primary}10`,
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
              >
                <View style={styles.lastContentInfo}>
                  <Text style={[styles.lastContentName, { color: colors.onSurface }]} numberOfLines={1}>
                    {lastContent.title}
                  </Text>
                  <Text style={[styles.lastContentMeta, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                    {lastContent.specialty} • {lastContent.type}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  heroSection: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ scale: 1.2 }],
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    transform: [{ scale: 1.2 }],
  },
  heroContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.9,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  heroButtonIcon: {
    marginLeft: 8,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  aiIconContainer: {
    marginRight: 16,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  aiBannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  tabsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 8,
  },
  tabsScrollContent: {
    paddingHorizontal: 4,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  lastContentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  lastContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lastContentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastContentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  lastContentInfo: {
    flex: 1,
    marginRight: 12,
  },
  lastContentName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastContentMeta: {
    fontSize: 13,
  },
}); 