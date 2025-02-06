import { API_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body as string) : undefined,
    };

    if (options.headers) {
      axiosConfig.headers = Object.fromEntries(
        Object.entries(options.headers).map(([key, value]) => [key, value?.toString() || ''])
      );
    }

    const response = await api.request(axiosConfig);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Request failed');
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('API Request Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to complete request';
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Please log in again',
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
} 