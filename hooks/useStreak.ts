import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

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
  const raw = await AsyncStorage.getItem(key);
  const today = getTodayLocal();

  let stored: StoredStreak | null = null;
  if (raw) {
    try {
      stored = JSON.parse(raw) as StoredStreak;
    } catch {
      stored = null;
    }
  }

  let newDays: number;
  let newLastActive: string;

  if (!stored || !stored.lastActiveDate) {
    newDays = 0;
    newLastActive = today;
  } else if (stored.lastActiveDate === today) {
    newDays = stored.days;
    newLastActive = today;
  } else {
    const diff = daysBetween(stored.lastActiveDate, today);
    if (diff === 1) {
      newDays = stored.days + 1;
      newLastActive = today;
    } else if (diff >= 3) {
      newDays = 0;
      newLastActive = today;
    } else {
      newDays = stored.days + 1;
      newLastActive = today;
    }
  }

  await AsyncStorage.setItem(
    key,
    JSON.stringify({ lastActiveDate: newLastActive, days: newDays }),
  );
  return newDays;
}

async function loadStreak(userId: string): Promise<number> {
  const key = STREAK_KEY(userId);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return 0;
  try {
    const stored = JSON.parse(raw) as StoredStreak;
    return stored.days ?? 0;
  } catch {
    return 0;
  }
}

export function useStreak() {
  const { user } = useAuth();
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setDays(0);
      return;
    }

    let cancelled = false;

    loadAndUpdateStreak(user.id).then((updated) => {
      if (!cancelled) setDays(updated);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { days };
}
