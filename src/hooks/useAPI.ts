import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getErrorMessage } from '../utils/errorHandling';

interface APIHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useAPI<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: APIHookOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(...args);
      setData(result);
      options.onSuccess?.(result);
      
      if (options.successMessage) {
        Alert.alert('Success', options.successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      options.onError?.(new Error(errorMessage));
      
      if (options.errorMessage) {
        Alert.alert('Error', options.errorMessage);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  return {
    loading,
    error,
    data,
    execute,
    clearError: () => setError(null),
  };
} 