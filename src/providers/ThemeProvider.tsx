import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { theme } from '../config/theme';

type ThemeColors = typeof theme.colors;
type ThemeContextType = {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(deviceColorScheme === 'dark');
  }, [deviceColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors = isDarkMode ? { ...theme.colors, ...theme.dark } : theme.colors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 