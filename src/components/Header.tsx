import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { shadow } from '../theme/styles';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function Header({ 
  title, 
  showBack = true,
  rightIcon,
  onRightPress 
}: HeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outline 
        },
        shadow.small
      ]}
    >
      <View style={styles.content}>
        {showBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={theme.colors.onSurface} 
            />
          </Pressable>
        )}
        <Text 
          variant="titleLarge" 
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {title}
        </Text>
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ionicons 
              name={rightIcon} 
              size={24} 
              color={theme.colors.onSurface} 
            />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 