import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { routes } from '@/constants/routes';
import { REGISTRATION_ONBOARDING_SECTIONS } from '@/constants/onboarding';
import { getErrorMessage } from '@/utils/errors';
import { getCurrentLanguage, isSupportedLocale } from '@/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { THEME_STORAGE_KEY } from '@/contexts/ThemeContext';
import { authService } from '@/services/api/authService';
import { userService } from '@/services/api/userService';
import { userSettingsService } from '@/services/api/userSettingsService';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  birthdate?: string | null;
  country?: string;
  city?: string;
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
      const authData = await authService.signUp({
        email: data.email,
        password: data.password,
        fullName: data.name,
      });
      if (authData?.user?.id) {
        await userService.updateUser(authData.user.id, {
          full_name: data.name,
          phone: data.phone?.trim() || undefined,
          birthdate: data.birthdate || undefined,
          country: data.country?.trim() || undefined,
          city: data.city?.trim() || undefined,
        });
      }
      return authData;
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
        for (const section of REGISTRATION_ONBOARDING_SECTIONS) {
          try {
            await userSettingsService.setSetting(
              userId,
              `onboarding_${section}_completed`,
              false,
            );
          } catch {
            //
          }
        }
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/onboarding?section=home' as never);
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
