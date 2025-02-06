import React from 'react';
import { TouchableOpacity, View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends ViewProps {
  onPress?: () => void;
}

export default function Card({ style, onPress, children, ...props }: CardProps) {
  const { theme } = useTheme();

  const cardStyle = [
    styles.card,
    { backgroundColor: theme.colors.card },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 