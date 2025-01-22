import { API_URL } from '../config';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    specialty?: string;
    hospital?: string;
  };
  token?: string;
}

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  image?: string | null;
  specialty?: string;
  hospital?: string;
}

class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async init() {
    this.token = await SecureStore.getItemAsync('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      // Add this header for mobile apps to handle CORS properly
      'X-Client-Platform': Platform.OS,
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      // Log response details for debugging
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email, apiUrl: API_URL });
      
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      console.log('Login response:', data);
      
      // If we have a token and user object, consider it a successful login
      if (data.token && data.user) {
        // Store the token securely
        await SecureStore.setItemAsync('auth_token', data.token);
        this.token = data.token;
        
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            specialty: data.user.specialty,
            hospital: data.user.hospital,
          },
          token: data.token,
        };
      }

      throw new Error(data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
      await SecureStore.deleteItemAsync('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the token on error
      await SecureStore.deleteItemAsync('auth_token');
      this.token = null;
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have a token
      if (!this.token) {
        await this.init();
        if (!this.token) {
          return null;
        }
      }

      const response = await this.request('/api/auth/me');
      const data = await response.json();
      
      if (data.user) {
        const currentUser: User = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.name,
          phoneNumber: data.user.phoneNumber,
          emailVerified: data.user.emailVerified,
          image: data.user.image,
          specialty: data.user.specialty,
          hospital: data.user.hospital,
        };
        return currentUser;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

export const api = ApiClient.getInstance(); 