import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Text from './Text';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost';
  loading?: boolean;
  children?: React.ReactNode;
}

export default function Button({ 
  style, 
  variant = 'default', 
  loading = false,
  disabled,
  children,
  ...props 
}: ButtonProps) {
  const { theme } = useTheme();

  const buttonStyle = [
    styles.base,
    variant === 'default' && [styles.default, { backgroundColor: theme.colors.primary }],
    variant === 'outline' && [styles.outline, { borderColor: theme.colors.primary }],
    variant === 'ghost' && styles.ghost,
    (disabled || loading) && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? 'white' : theme.colors.primary} />
      ) : typeof children === 'string' ? (
        <Text 
          style={[
            styles.text,
            variant === 'default' && styles.textDefault,
            variant !== 'default' && { color: theme.colors.primary }
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  default: {
    backgroundColor: '#1DB954',
  },
  outline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textDefault: {
    color: 'white',
  },
}); 