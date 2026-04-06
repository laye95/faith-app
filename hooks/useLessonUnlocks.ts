import { useAuth } from '@/contexts/AuthContext';
import { MODULES } from '@/constants/modules';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { useIntroVideoWatched } from '@/hooks/useIntroVideoWatched';
import {
  groupQuizAttemptsByModuleId,
  quizAttemptService,
} from '@/services/api/quizAttemptService';
import { queryKeys } from '@/services/queryKeys';
import {
  getNextUnlockedLesson,
  getNextUnlockedTarget,
  isExamUnlocked,
  isLessonUnlocked,
} from '@/utils/unlockLogic';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const QUIZ_ATTEMPTS_STALE_MS = 5 * 60 * 1000;

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

  const { data: allQuizAttempts, isLoading: quizAttemptsLoading } = useQuery({
    queryKey: queryKeys.progress.allQuizAttempts(user?.id ?? ''),
    queryFn: () => quizAttemptService.listAllByUser(user!.id),
    enabled: !!user?.id,
    staleTime: QUIZ_ATTEMPTS_STALE_MS,
  });

  const attemptsByModuleId = useMemo(
    () => groupQuizAttemptsByModuleId(allQuizAttempts),
    [allQuizAttempts],
  );

  const completedLessonIds = useMemo(() => {
    if (!completedLessons) return new Set<string>();
    return new Set(completedLessons.map((p) => p.lesson_id));
  }, [completedLessons]);

  const passedModuleIds = useMemo(() => {
    const set = new Set<string>();
    MODULES.forEach((m) => {
      const attempts = attemptsByModuleId.get(m.id) ?? [];
      const passed = attempts.some((a) => a.passed);
      if (passed) set.add(m.id);
    });
    return set;
  }, [attemptsByModuleId]);

  const isLoading = completedLoading || introLoading || quizAttemptsLoading;

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
      const attempts = attemptsByModuleId.get(moduleId) ?? [];
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
    [passedModuleIds, attemptsByModuleId],
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
