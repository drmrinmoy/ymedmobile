import { Tabs } from 'expo-router';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export default function TabsLayout() {
  const { colors, isDarkMode } = useTheme();

  const paperTheme = isDarkMode ? {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceVariant,
      onSurface: colors.onSurface,
      onSurfaceVariant: colors.onSurfaceVariant,
    }
  } : {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: colors.primary,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceVariant,
      onSurface: colors.onSurface,
      onSurfaceVariant: colors.onSurfaceVariant,
    }
  };

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.outline,
              height: Platform.OS === 'ios' ? 88 : 68,
              paddingBottom: Platform.OS === 'ios' ? 28 : 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.onSurfaceVariant,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: 'Library',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="library-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="ai"
            options={{
              title: 'AI',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bulb-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </PaperProvider>
  );
} 