import { useAuth } from '@/contexts/AuthContext';
import { MODULES } from '@/constants/modules';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { useIntroVideoWatched } from '@/hooks/useIntroVideoWatched';
import { quizAttemptService } from '@/services/api/quizAttemptService';
import { queryKeys } from '@/services/queryKeys';
import {
  getNextUnlockedLesson,
  getNextUnlockedTarget,
  isExamUnlocked,
  isLessonUnlocked,
} from '@/utils/unlockLogic';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface ExamStatusForModule {
  passed: boolean;
  attemptCount?: number;
  latestFailedAttempt?: { score: number; correct: number; total: number };
}

export function useLessonUnlocks() {
  const { user } = useAuth();
  const { data: completedLessons, isLoading: completedLoading } =
    useCompletedLessons(user?.id);
  const { hasWatched: introVideoWatched, isLoading: introLoading } =
    useIntroVideoWatched();

  const quizQueries = useQueries({
    queries: MODULES.map((m) => ({
      queryKey: queryKeys.progress.quizAttempts(user?.id ?? '', m.id),
      queryFn: () =>
        quizAttemptService.listByUserAndModule(user!.id, m.id),
      enabled: !!user?.id,
    })),
  });

  const completedLessonIds = useMemo(() => {
    if (!completedLessons) return new Set<string>();
    return new Set(completedLessons.map((p) => p.lesson_id));
  }, [completedLessons]);

  const passedModuleIds = useMemo(() => {
    const set = new Set<string>();
    MODULES.forEach((m, i) => {
      const attempts = quizQueries[i]?.data ?? [];
      const passed = attempts.some((a) => a.passed);
      if (passed) set.add(m.id);
    });
    return set;
  }, [quizQueries]);

  const isLoading = completedLoading || introLoading || quizQueries.some((q) => q.isLoading);

  const checkLessonUnlocked = useMemo(
    () => (moduleId: string, lesson: { id: string; moduleId: string; order: number }) =>
      isLessonUnlocked(moduleId, lesson, completedLessonIds, passedModuleIds, introVideoWatched),
    [completedLessonIds, passedModuleIds, introVideoWatched],
  );

  const checkExamUnlocked = useMemo(
    () => (moduleId: string) =>
      isExamUnlocked(moduleId, completedLessonIds),
    [completedLessonIds],
  );

  const nextUnlockedLesson = useMemo(
    () => getNextUnlockedLesson(completedLessonIds, passedModuleIds, introVideoWatched),
    [completedLessonIds, passedModuleIds, introVideoWatched],
  );

  const nextUnlockedTarget = useMemo(
    () => getNextUnlockedTarget(completedLessonIds, passedModuleIds, introVideoWatched),
    [completedLessonIds, passedModuleIds, introVideoWatched],
  );

  const getExamStatusForModule = useMemo(
    () => (moduleId: string): ExamStatusForModule => {
      const passed = passedModuleIds.has(moduleId);
      const moduleIndex = MODULES.findIndex((m) => m.id === moduleId);
      const attempts = quizQueries[moduleIndex]?.data ?? [];
      const latestAttempt = attempts[0];
      if (passed) {
        return { passed, attemptCount: attempts.length };
      }
      if (!latestAttempt) {
        return { passed: false };
      }
      const total =
        latestAttempt.total_count ??
        (Object.keys(latestAttempt.answers ?? {}).length || 1);
      const correct =
        latestAttempt.correct_count ??
        Math.round((latestAttempt.score_percentage / 100) * total);
      return {
        passed: false,
        attemptCount: attempts.length,
        latestFailedAttempt: {
          score: latestAttempt.score_percentage,
          correct,
          total,
        },
      };
    },
    [passedModuleIds, quizQueries],
  );

  return {
    completedLessonIds,
    passedModuleIds,
    isLessonUnlocked: checkLessonUnlocked,
    isExamUnlocked: checkExamUnlocked,
    getExamStatusForModule,
    nextUnlockedLesson,
    nextUnlockedTarget,
    isLoading,
  };
}
