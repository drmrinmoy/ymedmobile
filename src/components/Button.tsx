import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import type { ButtonProps as PaperButtonProps } from 'react-native-paper';

interface ButtonProps extends PaperButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ 
  variant = 'primary',
  mode = 'contained',
  ...props 
}: ButtonProps) {
  return (
    <PaperButton
      mode={mode}
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        props.style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
}); 