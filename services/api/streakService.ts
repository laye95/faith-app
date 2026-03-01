import type { UserStreak } from '@/types/badge';

import { BaseService } from './baseService';

class StreakService extends BaseService {
  protected tableName = 'user_streaks';

  async getStreak(userId: string): Promise<UserStreak | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.normalizeError(error);
      }

      return data as UserStreak;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async upsertStreak(
    userId: string,
    lastActiveDate: string,
    days: number,
  ): Promise<UserStreak> {
    return this.upsertWithConflict<UserStreak>(
      {
        user_id: userId,
        last_active_date: lastActiveDate,
        days,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
  }
}

export const streakService = new StreakService();
