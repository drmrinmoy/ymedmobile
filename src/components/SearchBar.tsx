import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getColorString } from '../utils/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChangeText, 
  onSubmit,
  placeholder = 'Search...' 
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.onSurface,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
}); 