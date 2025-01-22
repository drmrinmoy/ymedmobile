import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { shadow } from '../theme/styles';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  elevation?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ 
  children, 
  onPress, 
  style,
  elevation = 'small' 
}: CardProps) {
  const theme = useTheme();
  const cardStyle = [
    styles.card,
    { backgroundColor: theme.colors.surface },
    elevation !== 'none' && shadow[elevation],
    style
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
}); 