import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import { API_URL } from '../config';

type TabParamList = {
  Library: { activeTab?: string } | undefined;
  [key: string]: undefined | object;
};

type Props = BottomTabScreenProps<TabParamList, 'Library'>;

interface ContentItem {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  type: 'guidelines' | 'cases' | 'calculators' | 'quizzes';
}

const TABS = ['Guidelines', 'Cases', 'Calculators', 'Quizzes'];

export default function LibraryScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('Guidelines');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  useEffect(() => {
    // Listen for route params changes
    if (route.params?.activeTab && TABS.includes(route.params.activeTab)) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  const loadContent = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/${activeTab.toLowerCase()}`);
      setContent(response.data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Failed to load content. Please try again.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => 
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.tags?.some(tag => tag?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'guidelines': return 'book-outline';
      case 'cases': return 'document-text-outline';
      case 'calculators': return 'calculator-outline';
      case 'quizzes': return 'help-circle-outline';
      default: return 'document-outline';
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setContent([]);
  };
  const handleResultPress = (result: ContentItem) => {
    console.log('Pressed item:', result);
    
    const screenMap = {
      guidelines: 'Guidelines',
      cases: 'Cases',
      calculators: 'Calculators',
      quizzes: 'Quizzes'
    } as const;

    const screen = screenMap[result.type];
    if (screen) {
      console.log('Navigating to:', screen, { id: result.id });
      navigation.navigate(screen, { id: result.id });
    }
  };

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContent}
    >
      {TABS.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => handleTabPress(tab)}
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
  );

  const renderContent = () => (
    <ScrollView style={styles.content}>
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : filteredContent.length > 0 ? (
        filteredContent.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => {
              console.log('Card pressed:', item);
              handleResultPress(item);
            }}
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.primary }]}>
              <Ionicons 
                name={getIconForType(item.type)} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardSpecialty, { color: colors.onSurfaceVariant }]}>
                {item.specialty} • {item.type}
              </Text>
              <View style={styles.tags}>
                {item?.tags?.map((tag, index) => (
                  <Chip
                    key={tag?.id || index}
                    style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                    textStyle={{ color: colors.onSurfaceVariant }}
                  >
                    {tag?.name}
                  </Chip>
                ))}
              </View>
            </View>
          </Pressable>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
          No {activeTab.toLowerCase()} available
        </Text>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}
          iconColor={colors.onSurfaceVariant}
          inputStyle={{ color: colors.onSurface }}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>
      {renderTabs()}
      {error ? (
        <Text style={[styles.error, { color: colors.primary }]}>{error}</Text>
      ) : (
        renderContent()
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  tabsContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
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
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSpecialty: {
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
  error: {
    padding: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
}); 