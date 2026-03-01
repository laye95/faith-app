import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useCompactShadow } from '@/hooks/useShadows';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import type { Badge as BadgeType } from '@/types/badge';
import { Pressable, View } from 'react-native';

interface BadgeProps {
  badge: BadgeType;
  earned: boolean;
  progress?: { current: number; target: number };
  onPress?: () => void;
}

export function Badge({ badge, earned, progress, onPress }: BadgeProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const compactShadow = useCompactShadow();

  const content = (
    <View
      className="items-center justify-center p-2 rounded-xl w-full"
      style={{
        height: 100,
        backgroundColor: earned ? theme.cardBg : undefined,
        borderWidth: earned ? 1 : 0,
        borderColor: earned ? theme.cardBorder : undefined,
        ...(earned ? compactShadow : {}),
      }}
    >
      <View
        className="rounded-full w-12 h-12 items-center justify-center"
        style={{
          backgroundColor: earned ? theme.buttonPrimary : theme.avatarPrimary,
        }}
      >
        <Ionicons
          name={badge.icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={earned ? theme.buttonPrimaryContrast : theme.textTertiary}
          style={earned ? undefined : { opacity: 0.5 }}
        />
      </View>
      <Text
        className="text-xs font-medium mt-1 text-center"
        style={{ color: earned ? theme.textPrimary : theme.textSecondary }}
        numberOfLines={2}
      >
        {t(badge.name_key as never as string, {
          count: badge.target_value,
          module: badge.target_value,
        })}
      </Text>
      {progress && !earned && progress.target > 0 && (
        <Text
          className="text-xs mt-0 font-medium"
          style={{ color: theme.textTertiary }}
        >
          {progress.current}/{progress.target}
        </Text>
      )}
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
