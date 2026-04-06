import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import {
  pickThumbnailUrlFromPictures,
  vimeoService,
} from '@/services/vimeo/vimeoService';

export function useVimeoThumbnail(videoId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vimeo.meta(videoId ?? ''),
    queryFn: () => vimeoService.getVimeoVideoMetaRaw(videoId!),
    select: (data) => pickThumbnailUrlFromPictures(data.pictures),
    enabled: !!videoId,
    retry: 1,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
}
