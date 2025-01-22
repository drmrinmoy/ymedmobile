import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface ListItemProps {
  title: string;
  description?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export function ListItem({ 
  title, 
  description, 
  leftIcon, 
  rightIcon = 'chevron-forward',
  onPress 
}: ListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={styles.content}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Ionicons 
              name={leftIcon} 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text variant="bodyLarge">{title}</Text>
          {description && (
            <Text 
              variant="bodyMedium" 
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {description}
            </Text>
          )}
        </View>
        {rightIcon && (
          <Ionicons 
            name={rightIcon} 
            size={20} 
            color={theme.colors.onSurfaceVariant} 
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
}); 