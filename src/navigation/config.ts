import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { lightTheme } from '../theme';

export const defaultStackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: lightTheme.colors.surface,
  },
  headerTintColor: lightTheme.colors.onSurface,
  headerShadowVisible: false,
};

export const defaultTabScreenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    backgroundColor: lightTheme.colors.surface,
    borderTopColor: lightTheme.colors.outline,
  },
  tabBarActiveTintColor: lightTheme.colors.primary,
  tabBarInactiveTintColor: lightTheme.colors.onSurfaceVariant,
}; 