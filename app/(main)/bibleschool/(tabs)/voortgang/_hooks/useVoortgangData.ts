import { useAuth } from '@/contexts/AuthContext';
import { MODULES, TOTAL_LESSONS } from '@/constants/modules';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { useLessonUnlocks } from '@/hooks/useLessonUnlocks';
import { useStreak } from '@/hooks/useStreak';
import { useUserBadges } from '@/hooks/useUserBadges';
import { moduleProgressService } from '@/services/api/moduleProgressService';
import { queryKeys } from '@/services/queryKeys';
import type { UserBadge } from '@/types/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export type ModuleExamStatus =
  | 'passed'
  | 'failed'
  | 'ready'
  | 'in_progress'
  | 'locked'
  | 'not_started';

export interface ModuleProgressData {
  moduleId: string;
  order: number;
  titleKey: string;
  lessonCount: number;
  completedLessons: number;
  lessonPercentage: number;
  examStatus: ModuleExamStatus;
  examScore: number | undefined;
  isLocked: boolean;
}

export function useVoortgangData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: completedLessons, isLoading: lessonsLoading } =
    useCompletedLessons(user?.id);

  const { data: moduleProgressList, isLoading: moduleLoading } = useQuery({
    queryKey: queryKeys.progress.moduleProgress.overview(user?.id ?? ''),
    queryFn: () => moduleProgressService.listByUser(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const {
    passedModuleIds,
    getExamStatusForModule,
    isLoading: unlocksLoading,
  } = useLessonUnlocks();

  const { days: streakDays } = useStreak();
  const { badges, userBadges, isLoading: badgesLoading } = useUserBadges(user?.id);

  const completedCount = completedLessons?.length ?? 0;
  const overallPercentage =
    TOTAL_LESSONS > 0 ? Math.round((completedCount / TOTAL_LESSONS) * 100) : 0;

  const completedPerModule = useMemo(() => {
    const map = new Map<string, number>();
    completedLessons?.forEach((l) => {
      map.set(l.module_id, (map.get(l.module_id) ?? 0) + 1);
    });
    return map;
  }, [completedLessons]);

  const passedModuleCount = passedModuleIds.size;

  const moduleProgressData = useMemo((): ModuleProgressData[] => {
    return MODULES.map((module, index) => {
      const completedInModule = completedPerModule.get(module.id) ?? 0;
      const lessonPercentage = Math.round(
        (completedInModule / module.lessonCount) * 100,
      );
      const examInfo = getExamStatusForModule(module.id);
      const isPassed = passedModuleIds.has(module.id);
      const allLessonsDone = completedInModule === module.lessonCount;
      const prevModulePassed =
        index === 0 || passedModuleIds.has(MODULES[index - 1].id);

      let examStatus: ModuleExamStatus;
      let examScore: number | undefined;

      if (isPassed) {
        examStatus = 'passed';
        examScore = examInfo.latestFailedAttempt?.score;
        // If passed, get score from the examInfo — need to look at quizAttempts
        // passedModuleIds means at least one attempt passed
        // We don't have the passing score directly, mark as passed without score
        examScore = undefined;
      } else if (allLessonsDone && (examInfo.attemptCount ?? 0) > 0) {
        examStatus = 'failed';
        examScore = examInfo.latestFailedAttempt?.score;
      } else if (allLessonsDone) {
        examStatus = 'ready';
        examScore = undefined;
      } else if (completedInModule > 0) {
        examStatus = 'in_progress';
        examScore = undefined;
      } else if (!prevModulePassed && index > 0) {
        examStatus = 'locked';
        examScore = undefined;
      } else {
        examStatus = 'not_started';
        examScore = undefined;
      }

      return {
        moduleId: module.id,
        order: module.order,
        titleKey: module.titleKey,
        lessonCount: module.lessonCount,
        completedLessons: completedInModule,
        lessonPercentage,
        examStatus,
        examScore,
        isLocked: examStatus === 'locked',
      };
    });
  }, [completedPerModule, passedModuleIds, getExamStatusForModule]);

  const recentBadges = useMemo((): UserBadge[] => {
    return [...userBadges]
      .sort(
        (a, b) =>
          new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime(),
      )
      .slice(0, 3);
  }, [userBadges]);

  const onRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['progress'] });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.badges.userBadges(user?.id ?? ''),
    });
  }, [queryClient, user?.id]);

  return {
    isLoading: lessonsLoading || moduleLoading || unlocksLoading || badgesLoading,
    completedCount,
    overallPercentage,
    passedModuleCount,
    streakDays,
    moduleProgressData,
    badges,
    recentBadges,
    onRefresh,
  };
}

const __expoRouterPrivateRoute_useVoortgangData = () => null;

export default __expoRouterPrivateRoute_useVoortgangData;
