import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/services/queryKeys';
import { loadStreakDisplay } from '@/utils/streakActivity';
import { useQuery } from '@tanstack/react-query';

export function useStreak() {
  const { user } = useAuth();

  const { data: days = 0 } = useQuery({
    queryKey: queryKeys.streak.display(user?.id ?? ''),
    queryFn: () => loadStreakDisplay(user!.id),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  return { days };
}
