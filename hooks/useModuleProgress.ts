import { useQuery } from '@tanstack/react-query';

import { moduleProgressService } from '@/services/api/moduleProgressService';
import { queryKeys } from '@/services/queryKeys';

export function useModuleProgress(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.progress.moduleProgress.overview(userId ?? ''),
    queryFn: () => moduleProgressService.listByUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
