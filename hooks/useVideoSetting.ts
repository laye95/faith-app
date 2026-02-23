import { useAuth } from '@/contexts/AuthContext';
import { userSettingsService } from '@/services/api/userSettingsService';
import { useCallback, useEffect, useState } from 'react';

export type VideoQualityPreference = 'auto' | 'high' | 'medium' | 'low' | 'data_saver';

const VIDEO_QUALITY_KEY = 'video.quality';
const DEFAULT_QUALITY: VideoQualityPreference = 'auto';

export function useVideoSetting(): [
  VideoQualityPreference,
  (value: VideoQualityPreference) => Promise<void>,
  boolean,
] {
  const { user } = useAuth();
  const [value, setValueState] = useState<VideoQualityPreference>(DEFAULT_QUALITY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const stored = await userSettingsService.getSetting<string>(user.id, VIDEO_QUALITY_KEY);
        if (
          !cancelled &&
          stored !== null &&
          typeof stored === 'string' &&
          ['auto', 'high', 'medium', 'low', 'data_saver'].includes(stored)
        ) {
          setValueState(stored as VideoQualityPreference);
        }
      } catch {
        if (!cancelled) {
          setValueState(DEFAULT_QUALITY);
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
  }, [user?.id]);

  const setValue = useCallback(
    async (newValue: VideoQualityPreference) => {
      if (!user?.id) return;
      setValueState(newValue);
      try {
        await userSettingsService.setSetting(user.id, VIDEO_QUALITY_KEY, newValue);
      } catch {
        setValueState(value);
        throw new Error('Failed to save setting');
      }
    },
    [user?.id, value],
  );

  return [value, setValue, isLoading];
}
