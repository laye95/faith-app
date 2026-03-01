import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function AuthBackgroundDecor() {
  const theme = useTheme();

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: '15%',
          right: -60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: theme.cardBorder,
          opacity: theme.isDark ? 0.04 : 0.06,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: '25%',
          left: -80,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: theme.textTertiary,
          opacity: theme.isDark ? 0.03 : 0.04,
        }}
      />
    </View>
  );
}
