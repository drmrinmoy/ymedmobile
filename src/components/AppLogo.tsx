import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../providers/ThemeProvider';

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="512" y2="512">
      <stop offset="0" stop-color="rgb(131,58,180)"/>
      <stop offset="0.5" stop-color="rgb(253,29,29)"/>
      <stop offset="1" stop-color="rgb(252,176,69)"/>
    </linearGradient>
  </defs>
  <g>
    <rect width="512" height="512" rx="128" fill="var(--bg-color, url(#gradient))"/>
    <g transform="translate(96,96) scale(13.333)">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" fill="none" stroke="var(--icon-color, white)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" fill="none" stroke="var(--icon-color, white)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="10" r="2" fill="var(--icon-color, white)" stroke="var(--icon-color, white)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;

interface AppLogoProps {
  size?: number;
  showText?: boolean;
}

export function AppLogo({ size = 120, showText = true }: AppLogoProps) {
  const { colors, isDark } = useTheme();
  
  // Replace CSS variables in SVG
  const processedSvg = logoSvg
    .replace('var(--bg-color, url(#gradient))', colors.primary)
    .replace(/var\(--icon-color, white\)/g, colors.background);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: size, height: size }]}>
        <SvgXml 
          xml={processedSvg}
          width={size}
          height={size}
        />
      </View>
      {showText && (
        <Text 
          variant="headlineMedium" 
          style={[styles.text, { color: colors.text }]}
        >
          YMed
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 