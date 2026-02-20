import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { vimeoService } from '@/services/vimeo/vimeoService';

export function useVimeoThumbnail(videoId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vimeo.thumbnailUrl(videoId ?? ''),
    queryFn: () => vimeoService.getThumbnailUrl(videoId!),
    enabled: !!videoId,
    retry: 1,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
}
