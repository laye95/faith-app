import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { AppError, AppErrorCode } from '@/services/api/baseService';
import { authService } from '@/services/api/authService';
import { getErrorMessage } from '@/utils/errors';
import { useTranslation } from '@/hooks/useTranslation';

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginReturn {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return authService.login({ email, password });
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: async (err: unknown) => {
      const message =
        err instanceof AppError && err.code === AppErrorCode.AUTH_INVALID_CREDENTIALS
          ? t('auth.invalidCredentials')
          : getErrorMessage(err, t('auth.loginFailed'));
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const login = async (email: string, password: string) => {
    setError(null);
    await loginMutation.mutateAsync({ email, password });
  };

  return {
    login,
    isLoading: loginMutation.isPending,
    error,
  };
}

const __expoRouterPrivateRoute_useLogin = () => null;

export default __expoRouterPrivateRoute_useLogin;
