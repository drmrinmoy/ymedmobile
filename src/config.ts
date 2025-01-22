import { Platform } from 'react-native';

// Get the development machine's IP address when running in development
const DEV_API_URL = Platform.select({
  // For iOS simulator
  ios: 'http://172.17.2.170:3000',
  // For Android emulator
  android: 'http://10.0.2.2:3000',
  // Fallback for physical devices - replace with your machine's IP address
  default: 'http://172.17.2.170:3000',
});

// Production API URL
const PROD_API_URL = 'https://api.ymed.ai';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;

export const theme = {
  colors: {
    primary: '#1DB954',      // Spotify green
    background: '#FFFFFF',    // Light background
    surface: '#F5F5F5',      // Light surface
    surfaceVariant: '#EFEFEF', // Light secondary surface
    onSurface: '#121212',    // Dark text for light mode
    onSurfaceVariant: '#666666', // Secondary text for light mode
    outline: '#E0E0E0',      // Light mode borders
    border: '#E0E0E0',       // Light mode borders
    text: '#121212',         // Dark text for light mode
  },
  dark: {
    primary: '#1DB954',      // Spotify green
    background: '#121212',   // Spotify dark background
    surface: '#282828',      // Spotify card background
    surfaceVariant: '#181818', // Spotify secondary background
    onSurface: '#FFFFFF',    // White text
    onSurfaceVariant: '#B3B3B3', // Spotify secondary text
    outline: '#404040',      // Spotify borders
    border: '#404040',       // Spotify borders
    text: '#FFFFFF',         // White text
  }
}; 