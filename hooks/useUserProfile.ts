import { useQuery } from '@tanstack/react-query';

import { userService } from '@/services/api/userService';
import { queryKeys } from '@/services/queryKeys';

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId ?? ''),
    queryFn: () => userService.getById(userId!),
    enabled: !!userId,
  });
}
