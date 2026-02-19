import { useAuth } from '@/contexts/AuthContext';
import { moduleProgressService } from '@/services/api/moduleProgressService';
import { quizAttemptService } from '@/services/api/quizAttemptService';
import { queryKeys } from '@/services/queryKeys';
import { useQueries } from '@tanstack/react-query';
import { MODULES } from '@/constants/modules';
import { useMemo } from 'react';

export function useModuleProgress() {
  const { user } = useAuth();

  const progressQueries = useQueries({
    queries: MODULES.map((m) => ({
      queryKey: queryKeys.progress.moduleProgress.byUserModule(user?.id ?? '', m.id),
      queryFn: () => moduleProgressService.getByUserAndModule(user!.id, m.id),
      enabled: !!user?.id,
    })),
  });

  const attemptQueries = useQueries({
    queries: MODULES.map((m) => ({
      queryKey: queryKeys.progress.quizAttempts(user?.id ?? '', m.id),
      queryFn: () => quizAttemptService.listByUserAndModule(user!.id, m.id),
      enabled: !!user?.id,
    })),
  });

  const progressMap = useMemo(() => {
    const map: Record<string, (typeof progressQueries)[0]['data']> = {};
    MODULES.forEach((m, i) => {
      map[m.id] = progressQueries[i]?.data ?? null;
    });
    return map;
  }, [progressQueries]);

  const attemptCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    MODULES.forEach((m, i) => {
      const attempts = attemptQueries[i]?.data ?? [];
      map[m.id] = attempts.length;
    });
    return map;
  }, [attemptQueries]);

  const isLoading =
    progressQueries.some((q) => q.isLoading) ||
    attemptQueries.some((q) => q.isLoading);

  return {
    progressMap,
    attemptCountMap,
    isLoading,
  };
}
