export type BadgeCategory =
  | 'streak'
  | 'lesson'
  | 'module'
  | 'exam'
  | 'special';

export interface Badge {
  id: string;
  name_key: string;
  description_key: string;
  icon: string;
  category: BadgeCategory;
  target_value: number;
  order: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface UserStreak {
  user_id: string;
  last_active_date: string;
  days: number;
  updated_at: string;
}
