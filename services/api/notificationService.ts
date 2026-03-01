import type { BadgeEarnedData, UserNotification } from '@/types/notification';
import { BaseService } from './baseService';

class NotificationService extends BaseService {
  protected tableName = 'user_notifications';

  async createForBadges(
    userId: string,
    badges: { badge: { id: string; name_key: string; icon: string; target_value: number } }[],
  ): Promise<UserNotification[]> {
    if (badges.length === 0) return [];

    const items = badges.map(({ badge }) => ({
      user_id: userId,
      type: 'badge_earned' as const,
      data: {
        badge_id: badge.id,
        name_key: badge.name_key,
        icon: badge.icon,
        target_value: badge.target_value,
      } as BadgeEarnedData,
    }));

    return this.batchCreate<UserNotification>(items);
  }

  async listByUser(
    userId: string,
    limit = 20,
  ): Promise<UserNotification[]> {
    return this.list<UserNotification>({
      filters: [{ field: 'user_id', operator: 'eq', value: userId }],
      sort: [{ field: 'created_at', ascending: false }],
      pagination: { limit },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName!)
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) throw error;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async markAsRead(id: string): Promise<UserNotification> {
    return this.update<UserNotification>(id, {
      read_at: new Date().toISOString(),
    });
  }

  async remove(id: string): Promise<void> {
    return this.delete(id);
  }

  async removeAllByUser(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.tableName!)
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}

export const notificationService = new NotificationService();
