import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useThemePreference } from '@/contexts/ThemeContext';
import { bzzt } from '@/utils/haptics';
import type { ThemePreference } from '@/contexts/ThemeContext';

const CYCLE: ThemePreference[] = ['light', 'dark', 'system'];

const ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  light: 'sunny',
  dark: 'moon',
  system: 'phone-portrait',
};

export function ThemeToggleIcon() {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();

  const handlePress = () => {
    bzzt();
    const idx = CYCLE.indexOf(preference);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setPreference(next);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`Theme: ${preference}`}
      accessibilityHint="Double tap to cycle theme"
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <Ionicons
        name={ICONS[preference]}
        size={22}
        color={theme.textPrimary}
      />
    </TouchableOpacity>
  );
}

const __expoRouterPrivateRoute_ThemeToggleIcon = () => null;

export default __expoRouterPrivateRoute_ThemeToggleIcon;
