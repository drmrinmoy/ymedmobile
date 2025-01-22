import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { shadow } from '../theme/styles';

interface FABProps {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function FAB({ 
  icon, 
  label, 
  onPress,
  variant = 'primary' 
}: FABProps) {
  const theme = useTheme();

  const backgroundColor = variant === 'primary' 
    ? theme.colors.primary
    : theme.colors.secondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, opacity: pressed ? 0.9 : 1 },
        shadow.medium
      ]}
    >
      <Ionicons name={icon} size={24} color="white" />
      {label && (
        <Text 
          variant="labelLarge" 
          style={styles.label}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  label: {
    color: 'white',
    marginLeft: 8,
  },
}); 