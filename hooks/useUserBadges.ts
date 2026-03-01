import {
  checkAndAwardBadges,
  getBadges,
  getUserBadges,
} from '@/services/api/badgeService';
import { queryKeys } from '@/services/queryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useUserBadges(userId: string | undefined) {
  const queryClient = useQueryClient();

  const badgesQuery = useQuery({
    queryKey: queryKeys.badges.all,
    queryFn: getBadges,
    enabled: true,
  });

  const userBadgesQuery = useQuery({
    queryKey: queryKeys.badges.userBadges(userId ?? ''),
    queryFn: () => getUserBadges(userId!),
    enabled: !!userId,
  });

  const checkAndAward = async () => {
    if (!userId) return [];
    const newlyEarned = await checkAndAwardBadges(userId);
    if (newlyEarned.length > 0) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.badges.userBadges(userId),
      });
    }
    return newlyEarned;
  };

  return {
    badges: badgesQuery.data ?? [],
    userBadges: userBadgesQuery.data ?? [],
    isLoading: badgesQuery.isLoading || userBadgesQuery.isLoading,
    checkAndAward,
  };
}
