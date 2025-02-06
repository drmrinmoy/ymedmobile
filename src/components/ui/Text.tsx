import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface TextProps extends RNTextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'body' | 'caption';
}

export default function Text({ style, variant = 'default', ...props }: TextProps) {
  const { theme } = useTheme();

  const textStyle = [
    styles.base,
    variant === 'title' && styles.title,
    variant === 'subtitle' && styles.subtitle,
    variant === 'body' && styles.body,
    variant === 'caption' && styles.caption,
    { color: theme.colors.text },
    style
  ];

  return <RNText style={textStyle} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
}); 