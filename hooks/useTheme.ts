import { useThemePreference } from '@/contexts/ThemeContext';

export interface ThemeColors {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  buttonAccept: string;
  buttonDecline: string;
  buttonDeclineContrast: string;
  buttonPrimary: string;
  buttonPrimaryContrast: string;
  tabActive: string;
  tabInactiveBg: string;
  tabInactiveText: string;
  avatarPrimary: string;
  avatarWarning: string;
  badgeSuccess: string;
  badgeError: string;
  badgeWarning: string;
  badgeInfo: string;
  emptyBg: string;
  messageBg: string;
  isDark: boolean;
}

const lightTheme: ThemeColors = {
  pageBg: '#FFFFFF',
  cardBg: '#FAFAFA',
  cardBorder: '#E5E5E5',
  textPrimary: '#000000',
  textSecondary: '#525252',
  textTertiary: '#737373',
  buttonAccept: '#171717',
  buttonDecline: '#b91c1c',
  buttonDeclineContrast: '#FFFFFF',
  buttonPrimary: '#171717',
  buttonPrimaryContrast: '#FFFFFF',
  tabActive: '#171717',
  tabInactiveBg: '#F5F5F5',
  tabInactiveText: '#525252',
  avatarPrimary: '#E5E5E5',
  avatarWarning: '#fef3c7',
  badgeSuccess: '#dcfce7',
  badgeError: '#fee2e2',
  badgeWarning: '#fef3c7',
  badgeInfo: '#f5f5f5',
  emptyBg: '#F5F5F5',
  messageBg: '#FAFAFA',
  isDark: false,
};

const darkTheme: ThemeColors = {
  pageBg: '#0a0a0a',
  cardBg: '#171717',
  cardBorder: '#262626',
  textPrimary: '#FAFAFA',
  textSecondary: '#a3a3a3',
  textTertiary: '#737373',
  buttonAccept: '#FAFAFA',
  buttonDecline: '#f87171',
  buttonDeclineContrast: '#FFFFFF',
  buttonPrimary: '#FAFAFA',
  buttonPrimaryContrast: '#171717',
  tabActive: '#FAFAFA',
  tabInactiveBg: '#262626',
  tabInactiveText: '#a3a3a3',
  avatarPrimary: '#262626',
  avatarWarning: '#78350f',
  badgeSuccess: '#064e3b',
  badgeError: '#7f1d1d',
  badgeWarning: '#78350f',
  badgeInfo: '#262626',
  emptyBg: '#171717',
  messageBg: '#0a0a0a',
  isDark: true,
};

export function useTheme(): ThemeColors {
  const { effectiveScheme } = useThemePreference();
  return effectiveScheme === 'dark' ? darkTheme : lightTheme;
}
