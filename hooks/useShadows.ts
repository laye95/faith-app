import type { ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export function useCardShadow(): ViewStyle {
  const theme = useTheme();
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.25 : 0.06,
    shadowRadius: 16,
    elevation: 3,
  };
}

export function useButtonShadow(): ViewStyle {
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  };
}

export function useCompactShadow(): ViewStyle {
  const theme = useTheme();
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.2 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  };
}

export function useAuthCardShadow(): ViewStyle {
  const theme = useTheme();
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.35 : 0.1,
    shadowRadius: 20,
    elevation: 5,
  };
}
