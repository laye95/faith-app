import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { vimeoService } from '@/services/vimeo/vimeoService';

export function useVimeoPlaybackUrl(videoId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vimeo.playbackUrl(videoId ?? ''),
    queryFn: () => vimeoService.getPlaybackUrl(videoId!),
    enabled: !!videoId,
    retry: 2,
    staleTime: 20 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
