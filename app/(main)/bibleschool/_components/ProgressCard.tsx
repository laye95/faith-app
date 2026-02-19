import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { TOTAL_LESSONS } from '@/constants/modules';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { lessonProgressService } from '@/services/api/lessonProgressService';
import { queryKeys } from '@/services/queryKeys';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { OverviewCard } from './OverviewCard';

export function ProgressCard() {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: completedLessons } = useQuery({
    queryKey: queryKeys.progress.lessonProgress.completedByUser(user?.id ?? ''),
    queryFn: () => lessonProgressService.listCompletedByUser(user!.id),
    enabled: !!user?.id,
  });

  const completedCount = completedLessons?.length ?? 0;
  const percentage = TOTAL_LESSONS > 0
    ? Math.round((completedCount / TOTAL_LESSONS) * 100)
    : 0;

  return (
    <OverviewCard>
      <Box className="p-5">
        <HStack className="items-center gap-4">
          <Box
            className="rounded-xl p-3"
            style={{ backgroundColor: theme.avatarPrimary }}
          >
            <Ionicons name="bar-chart" size={28} color={theme.textPrimary} />
          </Box>
          <VStack className="flex-1">
            <HStack className="items-center justify-between">
              <Text
                className="text-lg font-bold"
                style={{ color: theme.textPrimary }}
              >
                {t('overview.progressTitle')}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.textSecondary }}
              >
                {percentage}%
              </Text>
            </HStack>
            <Text
              className="text-sm mt-1"
              style={{ color: theme.textSecondary }}
            >
              {t('overview.progressCount', { completed: completedCount, total: TOTAL_LESSONS })}
            </Text>
            <Box
              className="mt-3 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.avatarPrimary }}
            >
              <Box
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: theme.buttonPrimary,
                }}
              />
            </Box>
          </VStack>
        </HStack>
      </Box>
    </OverviewCard>
  );
}
