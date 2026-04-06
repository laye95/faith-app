import { useAuth } from '@/contexts/AuthContext';
import { moduleProgressService } from '@/services/api/moduleProgressService';
import {
  groupQuizAttemptsByModuleId,
  quizAttemptService,
} from '@/services/api/quizAttemptService';
import { queryKeys } from '@/services/queryKeys';
import { useQueries, useQuery } from '@tanstack/react-query';
import { MODULES } from '@/constants/modules';
import { useMemo } from 'react';

const QUIZ_ATTEMPTS_STALE_MS = 5 * 60 * 1000;

export function useModuleProgress() {
  const { user } = useAuth();

  const progressQueries = useQueries({
    queries: MODULES.map((m) => ({
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
    MODULES.forEach((m, i) => {
      map[m.id] = progressQueries[i]?.data ?? null;
    });
    return map;
  }, [progressQueries]);

  const attemptCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    MODULES.forEach((m) => {
      map[m.id] = attemptsByModuleId.get(m.id)?.length ?? 0;
    });
    return map;
  }, [attemptsByModuleId]);

  const isLoading =
    progressQueries.some((q) => q.isLoading) || quizAttemptsLoading;

  return {
    progressMap,
    attemptCountMap,
    isLoading,
  };
}
