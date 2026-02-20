import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { getErrorMessage } from '@/utils/errors';
import { authService } from '@/services/api/authService';

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginReturn {
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
      setError(getErrorMessage(err, 'Inloggen mislukt. Probeer het opnieuw.'));
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
