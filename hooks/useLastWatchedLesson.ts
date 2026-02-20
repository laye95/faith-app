import { MODULES } from '@/constants/modules';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useModule } from '@/hooks/useBibleschoolContent';
import { lessonProgressService } from '@/services/api/lessonProgressService';
import { queryKeys } from '@/services/queryKeys';
import type { BibleschoolLesson, BibleschoolModule } from '@/types/bibleschool';
import { useQuery } from '@tanstack/react-query';

export function useLastWatchedLesson(): {
  lesson: BibleschoolLesson | null;
  module: BibleschoolModule | null;
  isLoading: boolean;
} {
  const { user } = useAuth();
  const { locale } = useTranslation();

  const { data: lastWatched, isLoading } = useQuery({
    queryKey: queryKeys.progress.lessonProgress.lastWatchedByUser(user?.id ?? ''),
    queryFn: () => lessonProgressService.getLastWatchedByUser(user!.id),
    enabled: !!user?.id,
  });

  const { data: moduleData } = useModule(
    lastWatched?.module_id ?? undefined,
    locale,
  );

  if (!lastWatched) {
    return { lesson: null, module: null, isLoading };
  }

  const module = moduleData ?? null;
  const lesson =
    module?.lessons.find((l) => l.id === lastWatched.lesson_id) ?? null;

  return {
    lesson,
    module,
    isLoading: isLoading || (!moduleData && !!lastWatched),
  };
}
