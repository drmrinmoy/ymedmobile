import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export function isNetworkError(error: unknown): error is AxiosError<ErrorResponse> {
  return axios.isAxiosError(error);
}

export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    if (error.response) {
      return error.response.data?.message || 'An error occurred with the server';
    } else if (error.request) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return 'An error occurred while setting up the request';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function handleApiError(error: unknown): never {
  const message = getErrorMessage(error);
  throw new Error(message);
} 