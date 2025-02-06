import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform, Pressable } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { Text, Searchbar, SegmentedButtons, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GuidelinesList from '../components/library/GuidelinesList';
import CasesList from '../components/library/CasesList';
import CalculatorsList from '../components/library/CalculatorsList';
import QuizzesList from '../components/library/QuizzesList';
import DrugsList from '../components/library/DrugsList';

type LibrarySection = 'guidelines' | 'cases' | 'calculators' | 'quizzes' | 'drugs';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [section, setSection] = useState<LibrarySection>('guidelines');

  const handleItemPress = (type: LibrarySection, id: string) => {
    switch (type) {
      case 'guidelines':
        router.push(`/guidelines/${id}`);
        break;
      case 'cases':
        router.push(`/cases/${id}`);
        break;
      case 'calculators':
        router.push(`/calculators/${id}`);
        break;
      case 'quizzes':
        router.push(`/quizzes/${id}`);
        break;
      case 'drugs':
        router.push(`/drugs/${id}`);
        break;
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'guidelines':
        return <GuidelinesList searchQuery={searchQuery} onItemPress={(id) => handleItemPress('guidelines', id)} />;
      case 'cases':
        return <CasesList searchQuery={searchQuery} onItemPress={(id) => handleItemPress('cases', id)} />;
      case 'calculators':
        return <CalculatorsList searchQuery={searchQuery} onItemPress={(id) => handleItemPress('calculators', id)} />;
      case 'quizzes':
        return <QuizzesList searchQuery={searchQuery} onItemPress={(id) => handleItemPress('quizzes', id)} />;
      case 'drugs':
        return <DrugsList searchQuery={searchQuery} onItemPress={(id) => handleItemPress('drugs', id)} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Library</Text>
            <Pressable
              onPress={() => router.push('/bookmarks')}
              style={({ pressed }) => [
                styles.headerButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="bookmark-outline" size={24} color={colors.onSurface} />
            </Pressable>
          </View>

          <View style={styles.searchBarContainer}>
            <Surface style={[styles.searchBarSurface, { backgroundColor: colors.surface }]} elevation={2}>
              <Searchbar
                placeholder="Search library..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}
                inputStyle={{ 
                  color: colors.onSurface,
                  fontSize: 16,
                }}
                iconColor={colors.onSurfaceVariant}
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </Surface>
          </View>

          <Surface style={[styles.tabsWrapper, { backgroundColor: colors.surface }]} elevation={0}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tabsContainer}
              contentContainerStyle={styles.tabsContent}
            >
              {[
                { value: 'guidelines', label: 'Guidelines', icon: 'document-text' },
                { value: 'cases', label: 'Cases', icon: 'flask' },
                { value: 'calculators', label: 'Calculators', icon: 'calculator' },
                { value: 'quizzes', label: 'Quizzes', icon: 'school' },
                { value: 'drugs', label: 'Drugs', icon: 'medical' }
              ].map((tab) => (
                <Pressable
                  key={tab.value}
                  onPress={() => setSection(tab.value as LibrarySection)}
                  style={({ pressed }) => [
                    styles.tab,
                    { 
                      backgroundColor: section === tab.value ? `${colors.primary}15` : 'transparent',
                      opacity: pressed ? 0.7 : 1,
                    }
                  ]}
                >
                  <Ionicons 
                    name={tab.icon as any} 
                    size={18} 
                    color={section === tab.value ? colors.primary : colors.onSurfaceVariant} 
                    style={styles.tabIcon}
                  />
                  <Text style={[
                    styles.tabText,
                    { 
                      color: section === tab.value ? colors.primary : colors.onSurfaceVariant,
                      fontWeight: section === tab.value ? '600' : '400'
                    }
                  ]}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Surface>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      </View>
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
  header: {
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBarSurface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchBar: {
    elevation: 0,
    borderRadius: 16,
    height: 52,
  },
  tabsWrapper: {
    paddingVertical: 8,
    zIndex: 1,
  },
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
}); 