import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

interface StreakPillProps {
  days: number;
  onPress?: () => void;
}

export function StreakPill({ days, onPress }: StreakPillProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const content = (
    <View
      className="flex-row items-center gap-1.5 px-3 rounded-full"
      style={{
        height: 32,
        backgroundColor: theme.badgeWarning,
      }}
    >
      <Ionicons name="flame" size={16} color={theme.textPrimary} />
      <Text
        className="text-sm font-semibold"
        style={{ color: theme.textPrimary }}
      >
        {t('streak.days', { count: days })}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
