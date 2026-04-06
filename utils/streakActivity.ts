import AsyncStorage from '@react-native-async-storage/async-storage';

import { streakService } from '@/services/api/streakService';

const STREAK_KEY = (userId: string) => `faith_app_streak_${userId}`;

export interface StoredStreak {
  lastActiveDate: string;
  days: number;
}

export const STREAK_MIN_WATCH_SECONDS = 30;

export function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T12:00:00');
  const d2 = new Date(b + 'T12:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
}

async function loadStoredStreak(userId: string): Promise<StoredStreak | null> {
  const dbStreak = await streakService.getStreak(userId).catch(() => null);
  if (dbStreak) {
    return {
      lastActiveDate: dbStreak.last_active_date,
      days: dbStreak.days,
    };
  }
  const raw = await AsyncStorage.getItem(STREAK_KEY(userId));
  if (raw) {
    try {
      return JSON.parse(raw) as StoredStreak;
    } catch {
      return null;
    }
  }
  return null;
}

async function persistStreak(
  userId: string,
  lastActiveDate: string,
  days: number,
): Promise<void> {
  const toStore: StoredStreak = { lastActiveDate, days };
  await AsyncStorage.setItem(STREAK_KEY(userId), JSON.stringify(toStore));
  await streakService.upsertStreak(userId, lastActiveDate, days).catch(() => {});
}

export async function loadStreakDisplay(userId: string): Promise<number> {
  const today = getTodayLocal();
  const stored = await loadStoredStreak(userId);
  if (!stored || !stored.lastActiveDate) {
    return 0;
  }
  const diff = daysBetween(stored.lastActiveDate, today);
  if (diff >= 2) {
    if (stored.days > 0) {
      await persistStreak(userId, stored.lastActiveDate, 0);
    }
    return 0;
  }
  return stored.days;
}

export async function recordStreakActivity(userId: string): Promise<number> {
  const today = getTodayLocal();
  const stored = await loadStoredStreak(userId);

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

  await persistStreak(userId, newLastActive, newDays);
  return newDays;
}
