import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { vimeoService } from '@/services/vimeo/vimeoService';
import type { GetPlaybackUrlOptions } from '@/services/vimeo/vimeoService';

export function useVimeoPlaybackUrl(
  videoId: string | undefined,
  options?: GetPlaybackUrlOptions,
) {
  const qualityKey = options?.maxWidth ?? options?.preferHls ? 'adaptive' : 'default';
  return useQuery({
    queryKey: [...queryKeys.vimeo.playbackUrl(videoId ?? ''), qualityKey, options?.maxWidth, options?.preferHls],
    queryFn: () => vimeoService.getPlaybackUrl(videoId!, options),
    enabled: !!videoId,
    retry: 2,
    staleTime: 20 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
