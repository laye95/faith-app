import { useAuth } from '@/contexts/AuthContext';
import { useModules } from '@/hooks/useBibleschoolContent';
import { useTranslation } from '@/hooks/useTranslation';
import { moduleProgressService } from '@/services/api/moduleProgressService';
import {
  groupQuizAttemptsByModuleId,
  quizAttemptService,
} from '@/services/api/quizAttemptService';
import { queryKeys } from '@/services/queryKeys';
import { sortModulesByOrder } from '@/utils/bibleschoolCurriculum';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const QUIZ_ATTEMPTS_STALE_MS = 5 * 60 * 1000;

export function useModuleProgress() {
  const { user } = useAuth();
  const { locale } = useTranslation();
  const { data: modules = [] } = useModules(locale);
  const curriculum = useMemo(() => sortModulesByOrder(modules), [modules]);

  const progressQueries = useQueries({
    queries: curriculum.map((m) => ({
      queryKey: queryKeys.progress.moduleProgress.byUserModule(user?.id ?? '', m.id),
      queryFn: () => moduleProgressService.getByUserAndModule(user!.id, m.id),
      enabled: !!user?.id,
    })),
  });

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

  const progressMap = useMemo(() => {
    const map: Record<string, (typeof progressQueries)[0]['data']> = {};
    curriculum.forEach((m, i) => {
      map[m.id] = progressQueries[i]?.data ?? null;
    });
    return map;
  }, [progressQueries, curriculum]);

  const attemptCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    curriculum.forEach((m) => {
      map[m.id] = attemptsByModuleId.get(m.id)?.length ?? 0;
    });
    return map;
  }, [attemptsByModuleId, curriculum]);

  const isLoading =
    progressQueries.some((q) => q.isLoading) || quizAttemptsLoading;

  return {
    progressMap,
    attemptCountMap,
    isLoading,
  };
}

const __expoRouterPrivateRoute_useModuleProgress = () => null;

export default __expoRouterPrivateRoute_useModuleProgress;
