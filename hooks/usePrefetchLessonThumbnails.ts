import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { queryKeys } from '@/services/queryKeys';
import {
  pickThumbnailUrlFromPictures,
  vimeoService,
} from '@/services/vimeo/vimeoService';
import type { LessonLike } from '@/types/bibleschool';

function collectVideoIds(
  moduleId: string,
  lessons: LessonLike[],
  introductionVimeoId: string | undefined,
): string[] {
  const ids = new Set<string>();
  if (moduleId === 'module-1' && introductionVimeoId) {
    ids.add(introductionVimeoId);
  }
  lessons
    .filter((l) => l.videoId && !l.thumbnailUrl)
    .forEach((l) => ids.add(l.videoId!));
  return Array.from(ids);
}

export async function prefetchLessonThumbnailsForModule(
  queryClient: ReturnType<typeof useQueryClient>,
  moduleId: string,
  lessons: LessonLike[],
  introductionVimeoId: string | undefined,
): Promise<void> {
  const videoIds = collectVideoIds(moduleId, lessons, introductionVimeoId);
  if (videoIds.length === 0) return;

  await Promise.all(
    videoIds.map((videoId) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.vimeo.meta(videoId),
        queryFn: () => vimeoService.getVimeoVideoMetaRaw(videoId),
      }),
    ),
  );

  const urls = videoIds
    .map((id) => {
      const raw = queryClient.getQueryData<Awaited<
        ReturnType<typeof vimeoService.getVimeoVideoMetaRaw>
      >>(queryKeys.vimeo.meta(id));
      return raw ? pickThumbnailUrlFromPictures(raw.pictures) : null;
    })
    .filter((url): url is string => typeof url === 'string' && url.length > 0);

  if (urls.length > 0) {
    await Image.prefetch(urls, { cachePolicy: 'disk' });
  }
}

export function usePrefetchLessonThumbnails(
  moduleId: string | undefined,
  lessons: LessonLike[],
  introductionVimeoId: string | undefined,
): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!moduleId) return;

    const task = InteractionManager.runAfterInteractions(() => {
      prefetchLessonThumbnailsForModule(
        queryClient,
        moduleId,
        lessons,
        introductionVimeoId,
      );
    });

    return () => task.cancel();
  }, [moduleId, queryClient, introductionVimeoId, lessons]);
}
