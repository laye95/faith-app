import { useAuth } from '@/contexts/AuthContext';
import { userSettingsService } from '@/services/api/userSettingsService';
import { queryKeys } from '@/services/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Reads and writes the onboarding completion status for a given section.
 *
 * Setting key in user_settings: `onboarding_${section}_completed`
 *
 * Value semantics:
 *  - `null`  → never stored (existing user created before this feature) → skip
 *  - `false` → new user; onboarding for this section not yet completed → show
 *  - `true`  → completed → skip forever
 */
export function useOnboardingSection(section: string): {
  onboardingCompleted: boolean | null;
  markCompleted: () => Promise<void>;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';
  const settingKey = `onboarding_${section}_completed`;

  const { data: onboardingCompleted = null, isPending } = useQuery({
    queryKey: queryKeys.userSettings.onboardingSection(userId, section),
    queryFn: async () => {
      const row = await userSettingsService.getUserSettings(user!.id);
      if (!row) return null;
      const raw = row.settings[settingKey];
      if (raw === true) return true;
      if (raw === false) return false;
      return null;
    },
    enabled: !!user?.id,
    staleTime: 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await userSettingsService.setSetting(user!.id, settingKey, true);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.userSettings.onboardingSection(userId, section),
        true,
      );
    },
  });

  const markCompleted = useCallback(async () => {
    if (!user?.id) return;
    await mutation.mutateAsync();
  }, [user?.id, mutation.mutateAsync]);

  return {
    onboardingCompleted,
    markCompleted,
    isLoading: isPending || mutation.isPending,
  };
}
