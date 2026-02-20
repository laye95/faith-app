import { lessonProgressService } from '@/services/api/lessonProgressService';
import { queryKeys } from '@/services/queryKeys';
import { useQuery } from '@tanstack/react-query';

export function useCompletedLessons(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.progress.lessonProgress.completedByUser(userId ?? ''),
    queryFn: () => lessonProgressService.listCompletedByUser(userId!),
    enabled: !!userId,
  });
}
