import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
}

export function Badge({ 
  label, 
  variant = 'default',
  size = 'medium' 
}: BadgeProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'default':
        return theme.colors.onSurfaceVariant;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: size === 'small' ? 2 : 4,
          paddingHorizontal: size === 'small' ? 6 : 8,
        },
      ]}
    >
      <Text
        variant={size === 'small' ? 'bodySmall' : 'bodyMedium'}
        style={[styles.text, { color: getTextColor() }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 99,
  },
  text: {
    fontWeight: '500',
  },
}); 