import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { getCurrentLanguage, isSupportedLocale } from '@/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { authService } from '@/services/api/authService';
import { userSettingsService } from '@/services/api/userSettingsService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRegister(): UseRegisterReturn {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return authService.signUp({
        email: data.email,
        password: data.password,
        fullName: data.name,
      });
    },
    onSuccess: async (authData) => {
      if (authData?.user?.id) {
        try {
          const currentLanguage = getCurrentLanguage();
          if (isSupportedLocale(currentLanguage)) {
            await userSettingsService.setSetting(
              authData.user.id,
              'language',
              currentLanguage,
            );
          }
        } catch {
          // Non-blocking; language will sync on next login
        }
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    },
    onError: async (err: unknown) => {
      let errorMessage = t('auth.registrationFailed');
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const register = async (data: RegisterData) => {
    setError(null);
    await registerMutation.mutateAsync(data);
  };

  return {
    register,
    isLoading: registerMutation.isPending,
    error,
  };
}
