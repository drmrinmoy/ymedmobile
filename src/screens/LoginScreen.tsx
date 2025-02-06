import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { AppLogo } from '../components/AppLogo';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Get the API URL from environment variables or use a default

export function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement Google Sign In
      setError('Google Sign In not implemented yet');
    } catch (error: any) {
      setError('Something went wrong with Google Sign In');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement Apple Sign In
      setError('Apple Sign In not implemented yet');
    } catch (error: any) {
      setError('Something went wrong with Apple Sign In');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError(null);
    
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login to:', `${API_URL}${API_ENDPOINTS.login}`);
      const response = await axios.post(`${API_URL}${API_ENDPOINTS.login}`, {
        email: email.trim(),
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      console.log('Login response:', response.data);

      // Check if we have both token and user data
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        await signIn(token, user);
        await AsyncStorage.setItem('token', token);
        router.replace('/(tabs)');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (!error.response) {
          setError('Unable to connect to the server. Please check your internet connection.');
          console.log('API URL:', API_URL);
        } else {
          const errorMessage = error.response.data?.message || 'An error occurred during login.';
          console.error('Server error:', error.response.data);
          setError(errorMessage);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.logoContainer}>
            <AppLogo size={120} showText={true} />
          </View>
          
          <Text 
            variant="titleMedium"
            style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
          >
            Sign in to continue
          </Text>

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.errorText, { color: colors.primary }]}>{error}</Text>
            </View>
          )}

          <View style={styles.socialButtons}>
            <Button
              mode="outlined"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={[styles.socialButton, { borderColor: colors.outline }]}
              contentStyle={{ height: 48 }}
              labelStyle={{ fontSize: 16 }}
              icon={({ size, color }) => (
                <Ionicons name="logo-google" size={size} color={color} />
              )}
            >
              Continue with Google
            </Button>

            {Platform.OS === 'ios' && (
              <Button
                mode="outlined"
                onPress={handleAppleSignIn}
                disabled={isLoading}
                style={[styles.socialButton, { borderColor: colors.outline }]}
                contentStyle={{ height: 48 }}
                labelStyle={{ fontSize: 16 }}
                icon={({ size, color }) => (
                  <Ionicons name="logo-apple" size={size} color={color} />
                )}
              >
                Continue with Apple
              </Button>
            )}
          </View>

          <View style={styles.dividerContainer}>
            <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
            <Text style={[styles.dividerText, { color: colors.onSurfaceVariant }]}>or</Text>
            <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface }]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              placeholder="Email address"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textColor={colors.text}
              mode="outlined"
              outlineColor={colors.outline}
              activeOutlineColor={colors.primary}
              disabled={isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface }]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              placeholder="Password"
              placeholderTextColor={colors.onSurfaceVariant}
              secureTextEntry
              textColor={colors.text}
              mode="outlined"
              outlineColor={colors.outline}
              activeOutlineColor={colors.primary}
              disabled={isLoading}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.button, { backgroundColor: colors.primary }]}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }}
          >
            LOG IN
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  socialButtons: {
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    borderRadius: 24,
    borderWidth: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
  },
  button: {
    marginTop: 24,
    borderRadius: 24,
  },
}); 