import type { ComponentType } from 'react';
import type { Ionicons } from '@expo/vector-icons';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeSwitcher } from '../_components/ThemeSwitcher';
import { NotificationToggle } from '../_components/NotificationToggle';

export interface SettingsRowConfig {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  component: ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
  fullWidthChildren?: boolean;
  isLast?: boolean;
}

export interface SettingsSectionConfig {
  id: string;
  titleKey: string;
  rows: SettingsRowConfig[];
}

export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  {
    id: 'preferences',
    titleKey: 'settings.preferences',
    rows: [
      {
        id: 'language',
        icon: 'language',
        labelKey: 'settings.language',
        component: LanguageSwitcher,
        componentProps: { fullWidth: true },
        fullWidthChildren: true,
      },
      {
        id: 'theme',
        icon: 'color-palette',
        labelKey: 'settings.theme',
        component: ThemeSwitcher,
        componentProps: { fullWidth: true },
        fullWidthChildren: true,
        isLast: true,
      },
    ],
  },
  {
    id: 'notifications',
    titleKey: 'settings.notifications',
    rows: [
      {
        id: 'notifications-master',
        icon: 'notifications',
        labelKey: 'settings.notificationsPush',
        component: NotificationToggle,
        componentProps: { settingKey: 'notifications.enabled' },
        isLast: false,
      },
      {
        id: 'notifications-lessons',
        icon: 'book',
        labelKey: 'settings.notificationsLessonReminders',
        component: NotificationToggle,
        componentProps: { settingKey: 'notifications.lesson_reminders' },
        isLast: false,
      },
      {
        id: 'notifications-streak',
        icon: 'flame',
        labelKey: 'settings.notificationsStreakReminders',
        component: NotificationToggle,
        componentProps: { settingKey: 'notifications.streak_reminders' },
        isLast: false,
      },
      {
        id: 'notifications-exam',
        icon: 'school',
        labelKey: 'settings.notificationsExamReminders',
        component: NotificationToggle,
        componentProps: { settingKey: 'notifications.exam_reminders' },
        isLast: false,
      },
      {
        id: 'notifications-content',
        icon: 'sparkles',
        labelKey: 'settings.notificationsNewContent',
        component: NotificationToggle,
        componentProps: { settingKey: 'notifications.new_content' },
        isLast: true,
      },
    ],
  },
];
