import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  token?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  loginWithApple: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleConfig = Constants.expoConfig?.extra?.googleSignIn;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: googleConfig?.androidClientId,
    iosClientId: googleConfig?.iosClientId,
    webClientId: googleConfig?.webClientId,
    clientId: googleConfig?.webClientId,
  });

  useEffect(() => {
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleResponse(authentication?.accessToken);
    }
  }, [response]);

  const loadStoredUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (accessToken: string | undefined) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const userInfo = await response.json();
      const user: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photoUrl: userInfo.picture,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Error fetching Google user info:', error);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting login to:', `${API_URL}/api/auth/login`);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Invalid credentials',
        };
      }

      if (data.token) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          token: data.token,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }

      return {
        success: false,
        message: 'Invalid response from server',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  };

  const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        return { success: true };
      }
      return {
        success: false,
        message: 'Google sign in was cancelled or failed',
      };
    } catch (error: any) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: error.message || 'Failed to login with Google',
      };
    }
  };

  const loginWithApple = async (): Promise<AuthResponse> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const user: User = {
        id: credential.user,
        email: credential.email || '',
        ...(credential.fullName?.givenName && { name: credential.fullName.givenName }),
      };

      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          message: 'Apple sign in was cancelled',
        };
      }
      console.error('Apple login error:', error);
      return {
        success: false,
        message: error.message || 'Failed to login with Apple',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithApple,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 