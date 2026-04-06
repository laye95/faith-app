import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import {
  pickPlaybackUrlFromPlay,
  vimeoService,
} from '@/services/vimeo/vimeoService';
import type { GetPlaybackUrlOptions } from '@/services/vimeo/vimeoService';

export function useVimeoPlaybackUrl(
  videoId: string | undefined,
  options?: GetPlaybackUrlOptions,
) {
  return useQuery({
    queryKey: queryKeys.vimeo.meta(videoId ?? ''),
    queryFn: () => vimeoService.getVimeoVideoMetaRaw(videoId!),
    select: (data) => pickPlaybackUrlFromPlay(data.play, options),
    enabled: !!videoId,
    retry: 2,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
