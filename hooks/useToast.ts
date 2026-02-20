import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  show: (message: string, type?: 'success' | 'error') => void;
}

export function useToast(): ToastApi {
  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(message);
      }
      return;
    }
    Alert.alert(type === 'success' ? 'Success' : 'Error', message, [{ text: 'OK' }]);
  }, []);

  const success = useCallback((message: string) => show(message, 'success'), [show]);
  const error = useCallback((message: string) => show(message, 'error'), [show]);

  return { success, error, show };
}
