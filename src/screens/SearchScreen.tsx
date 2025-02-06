import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, ActivityIndicator, Platform, StatusBar, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, Chip, Searchbar, List, Surface } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { API_URL } from '../config';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useRouter } from 'expo-router';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface SearchResult {
  id: string;
  title: string;
  name?: string;  // For calculators
  type: 'guideline' | 'case' | 'calculator' | 'quiz' | 'drug';
  specialty?: string;
  description?: string;
  tags?: Array<{ id: string; name: string }>;
  // Drug specific fields
  genericName?: string;
  brandNames?: string[];
  drugClass?: string;
}

const POPULAR_CATEGORIES = [
  { title: 'Cardiology', icon: 'heart-outline' },
  { title: 'Neurology', icon: 'brain-outline' },
  { title: 'Pulmonology', icon: 'fitness-outline' },
  { title: 'Emergency', icon: 'medkit-outline' },
];

const TABS = ['All', 'Guidelines', 'Cases', 'Calculators', 'Quizzes', 'Drugs'] as const;
type TabType = typeof TABS[number];

interface SearchResults {
  guidelines: SearchResult[];
  cases: SearchResult[];
  calculators: SearchResult[];
  quizzes: SearchResult[];
  drugs: SearchResult[];
}

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [results, setResults] = useState<SearchResults>({
    guidelines: [],
    cases: [],
    calculators: [],
    quizzes: [],
    drugs: []
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    if (!debouncedQuery) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { 
          q: debouncedQuery, 
          type: activeTab.toLowerCase() === 'all' ? 'all' : activeTab.toLowerCase().slice(0, -1)
        }
      });

      const transformedData = response.data.map((item: SearchResult) => ({
        ...item,
        title: item.type === 'calculator' ? item.name : item.title
      }));

      const searchResults: SearchResults = {
        guidelines: transformedData.filter((item: SearchResult) => item.type === 'guideline'),
        cases: transformedData.filter((item: SearchResult) => item.type === 'case'),
        calculators: transformedData.filter((item: SearchResult) => item.type === 'calculator'),
        quizzes: transformedData.filter((item: SearchResult) => item.type === 'quiz'),
        drugs: transformedData.filter((item: SearchResult) => item.type === 'drug')
      };

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        guidelines: [],
        cases: [],
        calculators: [],
        quizzes: [],
        drugs: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect for autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2 || !isFocused) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/search`, {
          params: { q: debouncedQuery }
        });
        const suggestions = response.data.slice(0, 5).map((item: SearchResult) => item.title);
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, isFocused]);

  // Add keyboard listener effect
  useEffect(() => {
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocused(false);
    });

    return () => {
      keyboardDidHide.remove();
    };
  }, []);

  // Update the useEffect for search results
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, activeTab]);

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    Keyboard.dismiss();
    handleSearch();
  };

  const handleOutsidePress = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <Surface style={[styles.searchBarSurface, { backgroundColor: colors.surface }]} elevation={2}>
        <Searchbar
          placeholder="Search guidelines, cases, drugs..."
          onChangeText={(text) => {
            setQuery(text);
            if (text.length >= 2) {
              setIsFocused(true);
            }
          }}
          value={query}
          onFocus={() => {
            setIsFocused(true);
          }}
          onSubmitEditing={handleOutsidePress}
          style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}
          iconColor={colors.onSurfaceVariant}
          inputStyle={{ 
            color: colors.onSurface,
            fontSize: 16,
          }}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </Surface>
      {isFocused && suggestions.length > 0 && (
        <Surface 
          style={[
            styles.suggestionsContainer, 
            { backgroundColor: colors.surface }
          ]} 
          elevation={3}
        >
          {suggestions.map((suggestion, index) => (
            <Pressable
              key={index}
              onPress={() => handleSuggestionPress(suggestion)}
              style={({ pressed }) => [
                styles.suggestionItem,
                { 
                  backgroundColor: pressed ? `${colors.primary}10` : 'transparent',
                  borderBottomWidth: index === suggestions.length - 1 ? 0 : 1,
                  borderBottomColor: colors.outline
                }
              ]}
            >
              <Ionicons 
                name="search-outline" 
                size={20} 
                color={colors.onSurfaceVariant} 
                style={styles.suggestionIcon} 
              />
              <Text style={[styles.suggestionText, { color: colors.onSurface }]}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </Surface>
      )}
    </View>
  );

  const renderTabs = () => (
    <Surface style={[styles.tabsWrapper, { backgroundColor: colors.surface }]} elevation={0}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              if (query) handleSearch();
            }}
            style={({ pressed }) => [
              styles.tab,
              { 
                backgroundColor: activeTab === tab ? `${colors.primary}15` : 'transparent',
                opacity: pressed ? 0.7 : 1,
              }
            ]}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === tab ? colors.primary : colors.onSurfaceVariant,
                fontWeight: activeTab === tab ? '600' : '400'
              }
            ]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Surface>
  );

  const renderDrugResult = (result: SearchResult) => (
    <Pressable
      style={({ pressed }) => [
        styles.resultCard,
        { 
          backgroundColor: colors.surface,
          opacity: pressed ? 0.7 : 1,
          borderColor: colors.outline,
        }
      ]}
      onPress={() => router.push(`/drugs/${result.id}`)}
    >
      <View style={[styles.resultIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Ionicons name="medical-outline" size={24} color={colors.primary} />
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.onSurface }]} numberOfLines={1}>
          {result.title}
        </Text>
        {result.genericName && (
          <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
            Generic: {result.genericName}
          </Text>
        )}
        {result.drugClass && (
          <Text style={[styles.resultType, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
            Class: {result.drugClass}
          </Text>
        )}
        {result.brandNames && result.brandNames.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tags}
          >
            {result.brandNames.map((brand, index) => (
              <Chip
                key={index}
                style={[styles.tag, { backgroundColor: `${colors.primary}10` }]}
                textStyle={[styles.tagText, { color: colors.primary }]}
              >
                {brand}
              </Chip>
            ))}
          </ScrollView>
        )}
      </View>
    </Pressable>
  );

  const renderResult = (result: SearchResult) => {
    switch (result.type) {
      case 'drug':
        return renderDrugResult(result);
      default:
        return (
          <Pressable
            key={result.id}
            style={({ pressed }) => [
              styles.resultCard,
              { 
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
                borderColor: colors.outline,
              }
            ]}
            onPress={() => handleResultPress(result)}
          >
            <View style={[styles.resultIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name={getIconForType(result.type)} size={24} color={colors.primary} />
            </View>
            <View style={styles.resultContent}>
              <Text style={[styles.resultTitle, { color: colors.onSurface }]} numberOfLines={1}>
                {result.title}
              </Text>
              {result.specialty && (
                <Text style={[styles.resultType, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                  {result.specialty} • {result.type}
                </Text>
              )}
              {result.description && (
                <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                  {result.description}
                </Text>
              )}
              {result.tags && result.tags.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.tagsContainer}
                  contentContainerStyle={styles.tags}
                >
                  {result.tags.map((tag, index) => (
                    <Chip
                      key={tag.id || index}
                      style={[styles.tag, { backgroundColor: `${colors.primary}10` }]}
                      textStyle={[styles.tagText, { color: colors.primary }]}
                    >
                      {tag.name}
                    </Chip>
                  ))}
                </ScrollView>
              )}
            </View>
          </Pressable>
        );
    }
  };

  const renderSearchResults = (type: string) => {
    const currentResults = type.toLowerCase() === 'all'
      ? [...results.guidelines, ...results.cases, ...results.calculators, ...results.quizzes, ...results.drugs]
      : results[type.toLowerCase() as keyof SearchResults] || [];

    return (
      <ScrollView style={styles.results}>
        {currentResults.map((result: SearchResult) => renderResult(result))}
      </ScrollView>
    );
  };

  const renderPopularCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
        Popular Categories
      </Text>
      <View style={styles.categoriesGrid}>
        {POPULAR_CATEGORIES.map((category) => (
          <Pressable
            key={category.title}
            style={[styles.categoryCard, { backgroundColor: colors.surface }]}
            onPress={() => {
              setQuery(category.title);
              handleSearch();
            }}
          >
            <Ionicons 
              name={category.icon} 
              size={24} 
              color={colors.primary}
              style={styles.categoryIcon}
            />
            <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
              {category.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'drug': return 'medical-outline';
      case 'guideline': return 'book-outline';
      case 'case': return 'document-text-outline';
      case 'calculator': return 'calculator-outline';
      case 'quiz': return 'help-circle-outline';
      default: return 'document-outline';
    }
  };

  const handleResultPress = (result: SearchResult) => {
    switch (result.type) {
      case 'drug':
        router.push(`/drugs/${result.id}`);
        break;
      case 'guideline':
        router.push(`/guidelines/${result.id}`);
        break;
      case 'case':
        router.push(`/cases/${result.id}`);
        break;
      case 'calculator':
        router.push(`/calculators/${result.id}`);
        break;
      case 'quiz':
        router.push(`/quizzes/${result.id}`);
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={colors.background} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { backgroundColor: colors.background, zIndex: 1000 }]}>
            <Pressable onPress={handleOutsidePress}>
              <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Search</Text>
            </Pressable>
            {renderSearchBar()}
            {renderTabs()}
          </View>
          <View style={styles.contentWrapper}>
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : query ? (
                <>
                  {activeTab === 'All' ? (
                    Object.entries(results).map(([type, items]) =>
                      items.length > 0 && (
                        <View key={type} style={styles.section}>
                          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Text>
                          {items.map((result: SearchResult) => renderResult(result))}
                        </View>
                      )
                    )
                  ) : (
                    results[activeTab.toLowerCase() as keyof SearchResults].map((result) => renderResult(result))
                  )}
                </>
              ) : (
                <View style={styles.popularContainer}>
                  <Text style={[styles.popularTitle, { color: colors.onSurface }]}>
                    Popular Categories
                  </Text>
                  <View style={styles.popularGrid}>
                    {POPULAR_CATEGORIES.map((category) => (
                      <Pressable
                        key={category.title}
                        style={({ pressed }) => [
                          styles.categoryCard,
                          { 
                            backgroundColor: colors.surface,
                            opacity: pressed ? 0.7 : 1,
                            borderColor: colors.outline,
                          }
                        ]}
                        onPress={() => {
                          setQuery(category.title);
                          handleSearch();
                        }}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: `${colors.primary}15` }]}>
                          <Ionicons name={category.icon as any} size={24} color={colors.primary} />
                        </View>
                        <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
                          {category.title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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
    elevation: Platform.OS === 'android' ? 4 : 0,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBarContainer: {
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 16,
    paddingBottom: 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
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
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 8 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 15,
    flex: 1,
  },
  tabsWrapper: {
    paddingVertical: 8,
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 4 : 0,
  },
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
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
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  resultSubtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  resultType: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  popularContainer: {
    gap: 16,
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
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
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  results: {
    padding: 16,
  },
  categoriesSection: {
    gap: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
});