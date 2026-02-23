import { useAuth } from '@/contexts/AuthContext';
import { userSettingsService } from '@/services/api/userSettingsService';
import { useCallback, useEffect, useRef, useState } from 'react';

const INTRO_POSITION_KEY = 'bibleschool.intro_video_position';

export function useIntroVideoPosition(): {
  positionSeconds: number;
  savePosition: (seconds: number) => Promise<void>;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const saveInFlightRef = useRef(false);
  const pendingPositionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    userSettingsService
      .getSetting<number>(user.id, INTRO_POSITION_KEY)
      .then((stored) => {
        if (cancelled) return;
        const val = typeof stored === 'number' && stored >= 0 ? stored : 0;
        setPositionSeconds(val);
      })
      .catch(() => {
        if (cancelled) return;
        setPositionSeconds(0);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const savePosition = useCallback(
    async (seconds: number) => {
      if (!user?.id || seconds < 0) return;
      const position = Math.floor(seconds);

      if (saveInFlightRef.current) {
        pendingPositionRef.current = Math.max(
          position,
          pendingPositionRef.current ?? 0,
        );
        return;
      }

      saveInFlightRef.current = true;
      pendingPositionRef.current = null;

      try {
        await userSettingsService.setSetting(
          user.id,
          INTRO_POSITION_KEY,
          position,
        );
      } catch {
        //
      } finally {
        saveInFlightRef.current = false;
        if (pendingPositionRef.current !== null) {
          const next = pendingPositionRef.current;
          pendingPositionRef.current = null;
          savePosition(next);
        }
      }
    },
    [user?.id]
  );

  return {
    positionSeconds,
    savePosition,
    isLoading,
  };
}
