import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Chip, Searchbar, List } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { API_URL } from '../config';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../types/navigation';

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

const TABS = ['All', 'Guidelines', 'Cases', 'Calculators', 'Quizzes', 'Drugs'];

interface SearchResults {
  guidelines: SearchResult[];
  cases: SearchResult[];
  calculators: SearchResult[];
  quizzes: SearchResult[];
  drugs: SearchResult[];
}

export default function SearchScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [activeTab, setActiveTab] = useState('All');
  const [results, setResults] = useState<SearchResults>({
    guidelines: [],
    cases: [],
    calculators: [],
    quizzes: [],
    drugs: []
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    if (!debouncedQuery) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
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
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/search`, {
          params: { q: debouncedQuery }
        });
        const suggestions = response.data.slice(0, 5).map((item: SearchResult) => item.title);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Update the useEffect for search results
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, activeTab]);

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <Searchbar
        placeholder="Search guidelines, cases, drugs..."
        onChangeText={(text) => {
          setQuery(text);
          setShowSuggestions(true);
        }}
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Small delay to allow item click to register
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}
        iconColor={colors.onSurfaceVariant}
        inputStyle={{ color: colors.onSurface }}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.surface }]}>
          {suggestions.map((suggestion, index) => (
            <List.Item
              key={index}
              title={suggestion}
              onPress={() => {
                setQuery(suggestion);
                setShowSuggestions(false);
                handleSearch();
              }}
              titleStyle={{ color: colors.onSurface }}
              style={styles.suggestionItem}
              left={props => <List.Icon {...props} icon="magnify" />}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsWrapper}>
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
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.surfaceVariant }
            ]}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? colors.primary : colors.onSurfaceVariant }
            ]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderDrugResult = (result: SearchResult) => (
    <Pressable
      style={[styles.resultCard, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate('DrugDetails', { id: result.id })}
    >
      <View style={[styles.resultIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="medical-outline" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
          {result.title}
        </Text>
        {result.genericName && (
          <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]}>
            Generic: {result.genericName}
          </Text>
        )}
        {result.drugClass && (
          <Text style={[styles.resultType, { color: colors.onSurfaceVariant }]}>
            Class: {result.drugClass}
          </Text>
        )}
        {result.brandNames && result.brandNames.length > 0 && (
          <View style={styles.tags}>
            {result.brandNames.map((brand, index) => (
              <Chip
                key={index}
                style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                textStyle={{ color: colors.onSurfaceVariant }}
              >
                {brand}
              </Chip>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );

  const renderSearchResults = (type: string) => {
    const currentResults = type.toLowerCase() === 'all'
      ? [...results.guidelines, ...results.cases, ...results.calculators, ...results.quizzes, ...results.drugs]
      : results[type.toLowerCase() as keyof SearchResults] || [];

    return (
      <ScrollView style={styles.results}>
        {currentResults.map((result: SearchResult) => (
          <Pressable
            key={result.id}
            style={[styles.resultCard, { backgroundColor: colors.surface }]}
            onPress={() => handleResultPress(result)}
          >
            <View style={[styles.resultIcon, { backgroundColor: colors.primary }]}>
              <Ionicons 
                name={getIconForType(result.type)} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.resultContent}>
              <Text style={[styles.resultTitle, { color: colors.onSurface }]}>
                {result.title}
              </Text>
              <Text style={[styles.resultType, { color: colors.onSurfaceVariant }]}>
                {result.specialty} • {result.type}
              </Text>
              {result.type === 'drug' && result.genericName && (
                <Text style={[styles.resultSubtitle, { color: colors.onSurfaceVariant }]}>
                  Generic: {result.genericName}
                </Text>
              )}
              <View style={styles.tags}>
                {result.type === 'drug' && result.brandNames ? (
                  result.brandNames.map((brand, index) => (
                    <Chip
                      key={index}
                      style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                      textStyle={{ color: colors.onSurfaceVariant }}
                    >
                      {brand}
                    </Chip>
                  ))
                ) : (
                  result.tags?.map((tag, index) => (
                    <Chip
                      key={tag?.id || index}
                      style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                      textStyle={{ color: colors.onSurfaceVariant }}
                    >
                      {tag?.name}
                    </Chip>
                  ))
                )}
              </View>
            </View>
          </Pressable>
        ))}
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
        navigation.navigate('DrugDetails', { id: result.id });
        break;
      case 'guideline':
        navigation.navigate('Guidelines', { id: result.id });
        break;
      case 'case':
        navigation.navigate('Cases', { id: result.id });
        break;
      case 'calculator':
        navigation.navigate('Calculators', { id: result.id });
        break;
      case 'quiz':
        navigation.navigate('Quizzes', { id: result.id });
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderSearchBar()}
      {renderTabs()}
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : !query ? (
        <ScrollView style={styles.content}>
          {renderPopularCategories()}
        </ScrollView>
      ) : (
        renderSearchResults(activeTab.toLowerCase() as keyof SearchResults)
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 0,
    borderRadius: 12,
  },
  tabsWrapper: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,

  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  results: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultType: {
    fontSize: 14,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    height: 32,
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  searchBarContainer: {
    margin: 16,
    zIndex: 1000,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  resultSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
});