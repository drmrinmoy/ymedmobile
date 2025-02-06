import { useColorScheme } from 'react-native';

interface Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#1DB954',
    background: '#F7F7F7',
    card: '#FFFFFF',
    text: '#1A1A1A',
    border: '#E5E7EB',
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#1DB954',
    background: '#1A1A1A',
    card: '#2D2D2D',
    text: '#FFFFFF',
    border: '#404040',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return { theme, colorScheme };
} 