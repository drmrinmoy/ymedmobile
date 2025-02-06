import { Alert, Linking } from 'react-native';
import { apiRequest } from './api';
import type { User } from '../types/auth';

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  subscription: {
    id: string;
    status: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

type Duration = 'SIX_MONTHS' | 'ONE_YEAR' | 'TWO_YEARS' | 'FIVE_YEARS';

interface PaymentOptions {
  duration: Duration;
  couponCode?: string;
}

export const initializePayment = async (
  planId: string,
  user: User,
  token: string,
  options: PaymentOptions
) => {
  try {
    const response = await apiRequest<OrderData>('/api/mobile/subscription/create-order', {
      method: 'POST',
      body: JSON.stringify({
        planId,
        duration: options.duration,
        couponCode: options.couponCode
      }),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response?.success || !response?.data) {
      throw new Error(response?.error || 'Failed to create order');
    }

    const { paymentUrl } = response.data;
    
    // Open payment URL in default browser
    await Linking.openURL(paymentUrl);

    // Note: Payment verification will be handled by the web redirect URL
    // The web app should handle the success/failure redirect and update the subscription status
    
    return true;
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    Alert.alert('Error', error.message || 'Failed to initialize payment');
    return false;
  }
}; 