import { Box } from '@/components/ui/box';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { useModules } from '@/hooks/useBibleschoolContent';
import { adminAnalyticsService } from '@/services/api/adminAnalyticsService';
import { queryKeys } from '@/services/queryKeys';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatFullDate } from '@/utils/formatters';
import { sortModulesByOrder } from '@/utils/bibleschoolCurriculum';

export default function AdminUserDetailScreen() {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const { data: modules = [] } = useModules(locale);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.userDetail(id ?? ''),
    queryFn: () => adminAnalyticsService.getAdminUserDetail(id ?? ''),
    enabled: !!id,
  });

  const modulesByModuleId = useMemo(() => {
    return new Map(sortModulesByOrder(modules).map((m) => [m.id, m]));
  }, [modules]);

  const lastAttemptByModule = useMemo(() => {
    const quizAttempts = data?.quizAttempts ?? [];
    const map = new Map<
      string,
      { moduleId: string; scorePercentage: number; passed: boolean; completedAt: string }
    >();
    for (const q of quizAttempts) {
      const existing = map.get(q.moduleId);
      if (!existing || new Date(q.completedAt) > new Date(existing.completedAt)) {
        map.set(q.moduleId, q);
      }
    }
    return map;
  }, [data?.quizAttempts]);

  if (!id || isLoading || !data) {
    return <LoadingScreen message={t('common.loading')} />;
  }

  const { user, lessonCompletedCount, moduleProgress, quizAttempts } = data;

  const completedModules = moduleProgress.filter((p) => p.status === 'completed');
  const passedQuizzes = quizAttempts.filter((q) => q.passed);

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={user.fullName || user.email}
        currentSection="admin"
        showBackButton
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Box
          className="rounded-2xl p-5 mb-4"
          style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: theme.textPrimary }}
          >
            {user.fullName || user.email}
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: theme.textSecondary }}
          >
            {user.email}
          </Text>
          <Box className="flex-row gap-4 mt-3">
            <Text
              className="text-xs"
              style={{ color: theme.textTertiary }}
            >
              {t('admin.joined')}: {formatFullDate(user.createdAt)}
            </Text>
            <Text
              className="text-xs capitalize"
              style={{ color: theme.textTertiary }}
            >
              {user.role}
            </Text>
          </Box>
        </Box>

        <Box
          className="rounded-2xl p-5 mb-4"
          style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: theme.textSecondary }}
          >
            {t('admin.progressSummary')}
          </Text>
          <VStack className="gap-3">
            <Box className="flex-row justify-between items-center py-2">
              <Text
                className="text-sm"
                style={{ color: theme.textPrimary }}
              >
                {t('admin.lessonsCompleted')}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {lessonCompletedCount}
              </Text>
            </Box>
            <Box
              className="h-px"
              style={{ backgroundColor: theme.cardBorder }}
            />
            <Box className="flex-row justify-between items-center py-2">
              <Text
                className="text-sm"
                style={{ color: theme.textPrimary }}
              >
                {t('admin.modulesCompleted')}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {completedModules.length}
              </Text>
            </Box>
            <Box
              className="h-px"
              style={{ backgroundColor: theme.cardBorder }}
            />
            <Box className="flex-row justify-between items-center py-2">
              <Text
                className="text-sm"
                style={{ color: theme.textPrimary }}
              >
                {t('admin.quizAttempts')}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {quizAttempts.length} ({passedQuizzes.length} {t('admin.passed')})
              </Text>
            </Box>
          </VStack>
        </Box>

        {moduleProgress.length > 0 && (
          <Box
            className="rounded-2xl p-5 mb-4"
            style={{
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <Text
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: theme.textSecondary }}
            >
              {t('admin.moduleProgress')}
            </Text>
            <VStack className="gap-2">
              {moduleProgress.map((p) => {
                const mod = modulesByModuleId.get(p.moduleId);
                const quiz = lastAttemptByModule.get(p.moduleId);
                return (
                  <Box
                    key={p.moduleId}
                    className="flex-row items-center justify-between py-2"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: theme.cardBorder,
                    }}
                  >
                    <Text
                      className="text-sm font-medium flex-1"
                      style={{ color: theme.textPrimary }}
                      numberOfLines={1}
                    >
                      {mod ? mod.title : p.moduleId}
                    </Text>
                    <Box className="flex-row items-center gap-3">
                      <Text
                        className="text-xs capitalize"
                        style={{ color: theme.textSecondary }}
                      >
                        {p.status}
                      </Text>
                      {quiz && (
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color: quiz.passed ? theme.buttonPrimary : theme.buttonDecline,
                          }}
                        >
                          {quiz.scorePercentage}%
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}
