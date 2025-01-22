import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import Color from 'color';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Color('#3B82F6').rgb().string(),
    background: Color('#FFFFFF').rgb().string(),
    surface: Color('#FFFFFF').rgb().string(),
    surfaceVariant: Color('#F3F4F6').rgb().string(),
    onSurface: Color('#1F2937').rgb().string(),
    onSurfaceVariant: Color('#6B7280').rgb().string(),
    outline: Color('#E5E7EB').rgb().string(),
    elevation: {
      level0: Color('#FFFFFF').rgb().string(),
      level1: Color('#F9FAFB').rgb().string(),
      level2: Color('#F3F4F6').rgb().string(),
      level3: '',
      level4: '',
      level5: ''
    }
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Color('#60A5FA').rgb().string(),
    background: Color('#111827').rgb().string(),
    surface: Color('#1F2937').rgb().string(),
    surfaceVariant: Color('#374151').rgb().string(),
    onSurface: Color('#F9FAFB').rgb().string(),
    onSurfaceVariant: Color('#9CA3AF').rgb().string(),
    outline: Color('#374151').rgb().string(),
    elevation: {
      level0: Color('#111827').rgb().string(),
      level1: Color('#1F2937').rgb().string(),
      level2: Color('#374151').rgb().string(),
      level3: '',
      level4: '',
      level5: ''
    }
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
}; 