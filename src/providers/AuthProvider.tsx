import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { AuthContextType, User } from '@/types/auth';

export const AuthContext = createContext<AuthContextType>(null as unknown as AuthContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMobileToken = (userId: string) => {
    return `mobile-token-user-${userId}`;
  };

  const signIn = async (newToken: string, userData?: User) => {
    try {
      if (userData) {
        // Format token for mobile
        const mobileToken = formatMobileToken(userData.id);
        await SecureStore.setItemAsync('token', mobileToken);
        setToken(mobileToken);
        
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
        setUser(userData);
        return;
      }

      // If no userData, fetch profile using the original token
      const response = await fetch('YOUR_API_URL/api/mobile/profile', {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const fetchedUserData = await response.json();
      
      // Format token for mobile after getting user data
      const mobileToken = formatMobileToken(fetchedUserData.id);
      await SecureStore.setItemAsync('token', mobileToken);
      setToken(mobileToken);
      
      await SecureStore.setItemAsync('user', JSON.stringify(fetchedUserData));
      setUser(fetchedUserData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      setToken(null);
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 