import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { getNextLessonForUser } from '@/constants/modules';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { lessonProgressService } from '@/services/api/lessonProgressService';
import { queryKeys } from '@/services/queryKeys';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, type Href } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { bzzt } from '@/utils/haptics';
import { OverviewCard } from './OverviewCard';

export function ContinueLearningCard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: completedLessons, isLoading } = useQuery({
    queryKey: queryKeys.progress.lessonProgress.completedByUser(user?.id ?? ''),
    queryFn: () => lessonProgressService.listCompletedByUser(user!.id),
    enabled: !!user?.id,
  });

  const completedIds = new Set(completedLessons?.map((p) => p.lesson_id) ?? []);
  const nextInfo = !isLoading ? getNextLessonForUser(completedIds) : null;

  const subtitle = isLoading
    ? t('overview.continueLearningPlaceholder')
    : nextInfo
      ? t('overview.continueLearningNext', {
          moduleNumber: nextInfo.module.order,
          moduleName: t(nextInfo.module.titleKey),
          lessonNumber: nextInfo.lesson.order,
          lessonName: t(nextInfo.lesson.titleKey),
        })
      : t('overview.continueLearningAllDone');

  const handlePress = () => {
    if (isLoading) return;
    bzzt();
    if (nextInfo) {
      router.push(
        `/(main)/bibleschool/lesson/${nextInfo.module.id}/${nextInfo.lesson.id}`,
      );
    } else {
      router.push('/(main)/bibleschool/modules' as Href);
    }
  };

  return (
    <OverviewCard>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className="p-5 cursor-pointer"
        style={{ opacity: isLoading ? 0.6 : 1 }}
      >
        <HStack className="items-center justify-between">
          <HStack className="items-center gap-4 flex-1">
            <Box
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.avatarPrimary }}
            >
              <Ionicons name="book" size={28} color={theme.textPrimary} />
            </Box>
            <Box className="flex-1">
              <Text
                className="text-lg font-bold"
                style={{ color: theme.textPrimary }}
              >
                {t('overview.continueLearningTitle')}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                {subtitle}
              </Text>
            </Box>
          </HStack>
          <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
        </HStack>
      </TouchableOpacity>
    </OverviewCard>
  );
}
