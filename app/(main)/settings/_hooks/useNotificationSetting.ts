import { useAuth } from '@/contexts/AuthContext';
import { userSettingsService } from '@/services/api/userSettingsService';
import { useCallback, useEffect, useState } from 'react';

export function useNotificationSetting(
  key: string,
  defaultValue = true,
): [boolean, (value: boolean) => Promise<void>, boolean] {
  const { user } = useAuth();
  const [value, setValueState] = useState<boolean>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const stored = await userSettingsService.getSetting<boolean>(user.id, key);
        if (!cancelled && stored !== null && typeof stored === 'boolean') {
          setValueState(stored);
        }
      } catch {
        if (!cancelled) {
          setValueState(defaultValue);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id, key, defaultValue]);

  const setValue = useCallback(
    async (newValue: boolean) => {
      if (!user?.id) return;
      setValueState(newValue);
      try {
        await userSettingsService.setSetting(user.id, key, newValue);
      } catch {
        setValueState(value);
        throw new Error('Failed to save setting');
      }
    },
    [user?.id, key, value],
  );

  return [value, setValue, isLoading];
}

const __expoRouterPrivateRoute_useNotificationSetting = () => null;

export default __expoRouterPrivateRoute_useNotificationSetting;
