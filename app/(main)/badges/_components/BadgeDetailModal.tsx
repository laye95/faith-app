import { BaseModal } from '@/components/ui/BaseModal';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import type { Badge as BadgeType } from '@/types/badge';
import { Pressable, View } from 'react-native';

function getHowToEarnKey(badge: BadgeType): string {
  if (badge.id === 'intro_watched') return 'badges.howToEarn.intro_watched';
  if (badge.id === 'first_lesson') return 'badges.howToEarn.first_lesson';
  if (badge.id.startsWith('lesson_milestone_'))
    return 'badges.howToEarn.lesson_milestone';
  if (badge.id === 'student_van_het_woord')
    return 'badges.howToEarn.student_van_het_woord';
  if (badge.id.startsWith('streak_')) return 'badges.howToEarn.streak';
  if (badge.id === 'volharder') return 'badges.howToEarn.volharder';
  if (badge.id === 'strijder') return 'badges.howToEarn.strijder';
  if (badge.id === 'bijbelleraar') return 'badges.howToEarn.bijbelleraar';
  if (badge.id === 'faith_finisher') return 'badges.howToEarn.faith_finisher';
  if (badge.id === 'schriftgeleerde')
    return 'badges.howToEarn.schriftgeleerde';
  if (badge.id.startsWith('module_')) return 'badges.howToEarn.module';
  return badge.description_key;
}

interface BadgeDetailModalProps {
  visible: boolean;
  badge: BadgeType | null;
  earned: boolean;
  progress?: { current: number; target: number };
  onClose: () => void;
}

export function BadgeDetailModal({
  visible,
  badge,
  earned,
  progress,
  onClose,
}: BadgeDetailModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!badge) return null;

  const moduleNum = badge.id.startsWith('module_')
    ? parseInt(badge.id.replace('module_', ''), 10)
    : badge.target_value;
  const interpolation = {
    count: badge.target_value,
    module: moduleNum,
  };

  const description = t(badge.description_key as never as string, interpolation);

  const howToEarnKey = getHowToEarnKey(badge);
  const howToEarn =
    howToEarnKey.startsWith('badges.howToEarn.')
      ? t(howToEarnKey as never, interpolation)
      : description;

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      maxWidth={320}
      disableScale
    >
      <View className="flex-row justify-end -mt-2 mb-2">
        <View className="flex-1" />
        <Pressable
          onPress={onClose}
          accessibilityLabel={t('common.close')}
          accessibilityRole="button"
          className="p-1"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Ionicons name="close" size={24} color={theme.textSecondary} />
        </Pressable>
      </View>
      <View
        className="rounded-full w-16 h-16 items-center justify-center self-center mb-4"
        style={{
          backgroundColor: earned ? theme.buttonPrimary : theme.avatarPrimary,
        }}
      >
        <Ionicons
          name={badge.icon as keyof typeof Ionicons.glyphMap}
          size={32}
          color={earned ? theme.buttonPrimaryContrast : theme.textTertiary}
          style={earned ? undefined : { opacity: 0.5 }}
        />
      </View>
      <Text
        className="text-lg font-semibold mb-2 text-center"
        style={{ color: earned ? theme.textPrimary : theme.textSecondary }}
      >
        {t(badge.name_key as never as string, {
          count: badge.target_value,
          module: moduleNum,
        })}
      </Text>
      {earned ? (
        <Text
          className="text-sm text-center leading-5 mb-2"
          style={{ color: theme.textSecondary }}
        >
          {description}
        </Text>
      ) : (
        <>
          <Text
            className="text-xs font-semibold uppercase tracking-wider text-center mb-1"
            style={{ color: theme.textTertiary }}
          >
            {t('badges.howToEarnLabel' as never)}
          </Text>
          <Text
            className="text-sm text-center leading-5 mb-2"
            style={{ color: theme.textSecondary }}
          >
            {howToEarn}
          </Text>
        </>
      )}
      {progress && !earned && progress.target > 0 && (
        <Text
          className="text-xs font-medium text-center"
          style={{ color: theme.textTertiary }}
        >
          {progress.current}/{progress.target}
        </Text>
      )}
    </BaseModal>
  );
}

const __expoRouterPrivateRoute_BadgeDetailModal = () => null;

export default __expoRouterPrivateRoute_BadgeDetailModal;
