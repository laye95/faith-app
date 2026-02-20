import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { routes } from '@/constants/routes';
import { getErrorMessage } from '@/utils/errors';
import { getCurrentLanguage, isSupportedLocale } from '@/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { THEME_STORAGE_KEY } from '@/contexts/ThemeContext';
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
        const userId = authData.user.id;
        try {
          const currentLanguage = getCurrentLanguage();
          if (isSupportedLocale(currentLanguage)) {
            await userSettingsService.setSetting(
              userId,
              'language',
              currentLanguage,
            );
          }
        } catch {
          //
        }
        try {
          const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
          if (
            storedTheme &&
            (storedTheme === 'light' ||
              storedTheme === 'dark' ||
              storedTheme === 'system')
          ) {
            await userSettingsService.setSetting(
              userId,
              'theme',
              storedTheme,
            );
          }
        } catch {
          //
        }
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(routes.main());
    },
    onError: async (err: unknown) => {
      setError(getErrorMessage(err, t('auth.registrationFailed')));
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
