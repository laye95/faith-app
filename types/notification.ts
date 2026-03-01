export type NotificationType = 'badge_earned';

export interface BadgeEarnedData {
  badge_id: string;
  name_key: string;
  icon: string;
  target_value?: number;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  data: BadgeEarnedData;
  read_at: string | null;
  created_at: string;
}
