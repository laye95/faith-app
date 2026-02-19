import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import type { Module } from '@/constants/modules';
import type { ModuleProgress } from '@/types/progress';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface ModuleCardProps {
  module: Module;
  progress: ModuleProgress | null;
  attemptCount: number;
  onPress: () => void;
}

function StarRow({ percentage }: { percentage: number }) {
  const filledCount = Math.floor((percentage / 100) * 5);
  const hasHalf = (percentage / 100) * 5 - filledCount >= 0.5;
  const starColor = '#4ade80';

  return (
    <HStack className="gap-0.5" style={{ alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons
          key={i}
          name={
            i < filledCount
              ? 'star'
              : i === filledCount && hasHalf
                ? 'star-half'
                : 'star-outline'
          }
          size={16}
          color={starColor}
        />
      ))}
    </HStack>
  );
}

export function ModuleCard({
  module,
  progress,
  attemptCount,
  onPress,
}: ModuleCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const status = progress?.status ?? 'locked';
  const percentage = progress?.progress_percentage ?? 0;
  const isCompleted = status === 'completed';

  const statusLabel =
    status === 'completed'
      ? t('modules.status.passed')
      : status === 'in_progress'
        ? t('modules.status.inProgress')
        : t('modules.status.locked');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="cursor-pointer"
    >
      <Box
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDark ? 0.25 : 0.06,
          shadowRadius: 16,
          elevation: 3,
        }}
      >
        <Box className="px-5 pt-5 pb-6" style={{ minHeight: 140 }}>
          <Box className="absolute right-4 top-4">
            {isCompleted ? (
              <Box
                className="flex-row items-center gap-1.5 rounded-lg px-2.5 py-1"
                style={{ backgroundColor: 'rgba(74, 222, 128, 0.35)' }}
              >
                <Ionicons name="checkmark-circle" size={14} color={theme.textPrimary} />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {statusLabel}
                </Text>
              </Box>
            ) : status === 'in_progress' ? (
              <Box
                className="flex-row items-center gap-1.5 rounded-lg px-2.5 py-1"
                style={{ backgroundColor: 'rgba(96, 165, 250, 0.35)' }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {statusLabel}
                </Text>
              </Box>
            ) : null}
          </Box>

          <Box className="items-center pt-1">
            <Text
              className="text-base font-bold tracking-widest"
              style={{ color: theme.textSecondary }}
            >
              {t('modules.moduleLabel', { number: module.order })}
            </Text>
            <Text
              className="text-sm font-medium mt-1 text-center"
              style={{ color: theme.textPrimary }}
            >
              {t(module.titleKey as never)}
            </Text>
          </Box>

          <HStack
            className="items-center justify-between mt-6"
            style={{ marginHorizontal: 4 }}
          >
            <HStack className="items-center gap-3">
              <Text
                className="text-xs"
                style={{ color: theme.textSecondary }}
              >
                {attemptCount === 0
                  ? t('modules.attemptZero')
                  : attemptCount === 1
                    ? t('modules.attemptSingular')
                    : t('modules.attemptPlural', { count: attemptCount })}
              </Text>
              <StarRow percentage={percentage} />
              <Text
                className="text-sm font-bold"
                style={{ color: theme.textPrimary }}
              >
                {percentage}%
              </Text>
            </HStack>
            <Box
              className="rounded-full p-2"
              style={{ backgroundColor: theme.avatarPrimary }}
            >
              <Ionicons name="chevron-forward" size={28} color={theme.textPrimary} />
            </Box>
          </HStack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
