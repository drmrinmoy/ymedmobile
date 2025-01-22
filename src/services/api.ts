import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';
import type { User, Guideline, Case, Calculator, Quiz } from '../types/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (phone: string) => {
    const response = await api.post<{ token: string }>('/api/auth/login', { phone });
    return response.data;
  },
  
  verifyOTP: async (phone: string, code: string) => {
    const response = await api.post<{ token: string; user: User }>('/api/auth/verify', { 
      phone, 
      code 
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>('/api/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<User>('/api/profile', data);
    return response.data;
  },
};

// Content API
export const contentAPI = {
  getGuidelines: async () => {
    const response = await api.get<Guideline[]>('/api/guidelines');
    return response.data;
  },

  getGuideline: async (id: string) => {
    const response = await api.get<Guideline>(`/api/guidelines/${id}`);
    return response.data;
  },

  getCases: async () => {
    const response = await api.get<Case[]>('/api/cases');
    return response.data;
  },

  getCase: async (id: string) => {
    const response = await api.get<Case>(`/api/cases/${id}`);
    return response.data;
  },

  getCalculators: async () => {
    const response = await api.get<Calculator[]>('/api/calculators');
    return response.data;
  },

  getCalculator: async (id: string) => {
    const response = await api.get<Calculator>(`/api/calculators/${id}`);
    return response.data;
  },

  getQuizzes: async () => {
    const response = await api.get<Quiz[]>('/api/quizzes');
    return response.data;
  },

  getQuiz: async (id: string) => {
    const response = await api.get<Quiz>(`/api/quizzes/${id}`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (query: string) => {
    const response = await api.get('/api/search', { 
      params: { q: query } 
    });
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get('/api/search/trending');
    return response.data;
  },

  saveSearchHistory: async (query: string) => {
    await api.post('/api/search/history', { query });
  },

  getSearchHistory: async () => {
    const response = await api.get('/api/search/history');
    return response.data;
  },

  clearSearchHistory: async () => {
    await api.delete('/api/search/history');
  },
};

// AI Chat API
export const aiAPI = {
  sendMessage: async (message: string, history: { role: string; content: string }[]) => {
    const response = await api.post('/api/ai/chat', {
      message,
      history,
    });
    return response.data;
  },
};

export default api; 