import { useTheme } from '../providers/ThemeProvider';

export function useColorScheme() {
  const { isDarkMode } = useTheme();
  return isDarkMode ? 'dark' : 'light';
} 