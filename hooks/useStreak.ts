import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';

import { checkAndAwardBadges } from '@/services/api/badgeService';
import { streakService } from '@/services/api/streakService';

const STREAK_KEY = (userId: string) => `faith_app_streak_${userId}`;

interface StoredStreak {
  lastActiveDate: string;
  days: number;
}

function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T12:00:00');
  const d2 = new Date(b + 'T12:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
}

async function loadAndUpdateStreak(userId: string): Promise<number> {
  const key = STREAK_KEY(userId);
  const today = getTodayLocal();

  let stored: StoredStreak | null = null;
  const dbStreak = await streakService.getStreak(userId).catch(() => null);
  if (dbStreak) {
    stored = {
      lastActiveDate: dbStreak.last_active_date,
      days: dbStreak.days,
    };
  }
  if (!stored) {
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      try {
        stored = JSON.parse(raw) as StoredStreak;
      } catch {
        stored = null;
      }
    }
  }

  let newDays: number;
  let newLastActive: string;

  if (!stored || !stored.lastActiveDate) {
    newDays = 1;
    newLastActive = today;
  } else if (stored.lastActiveDate === today) {
    newDays = stored.days;
    newLastActive = today;
  } else {
    const diff = daysBetween(stored.lastActiveDate, today);
    if (diff === 1) {
      newDays = stored.days + 1;
      newLastActive = today;
    } else if (diff > 1) {
      newDays = 1;
      newLastActive = today;
    } else {
      newDays = stored.days;
      newLastActive = stored.lastActiveDate;
    }
  }

  const toStore = { lastActiveDate: newLastActive, days: newDays };
  await AsyncStorage.setItem(key, JSON.stringify(toStore));
  streakService.upsertStreak(userId, newLastActive, newDays).catch(() => {});
  checkAndAwardBadges(userId).catch(() => {});

  return newDays;
}

export function useStreak() {
  const { user } = useAuth();
  const [days, setDays] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!user?.id) {
      setDays(0);
      loadingRef.current = false;
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;
    let cancelled = false;

    loadAndUpdateStreak(user.id).then((updated) => {
      loadingRef.current = false;
      if (!cancelled) setDays(updated);
    });

    return () => {
      cancelled = true;
      loadingRef.current = false;
    };
  }, [user?.id]);

  return { days };
}
