import { useQuery } from '@tanstack/react-query';
import type { SupportedLocale } from '@/i18n';
import {
  MODULES,
  getLessonsForModule,
} from '@/constants/modules';
import { bibleschoolService } from '@/services/storyblok/bibleschoolService';
import { queryKeys } from '@/services/queryKeys';
import type { BibleschoolLesson, BibleschoolModule } from '@/types/bibleschool';
import { useTranslation } from '@/hooks/useTranslation';

function getFallbackModules(t: (key: string) => string): BibleschoolModule[] {
  return MODULES.map((m) => {
    const lessons = getLessonsForModule(m.id);
    return {
      id: m.id,
      title: t(m.titleKey as never),
      description: t(m.descriptionKey as never),
      lessonCount: m.lessonCount,
      order: m.order,
      moduleHandoutUrl: m.moduleHandoutUrl,
      lessons: lessons.map((l) => ({
        id: l.id,
        moduleId: l.moduleId,
        order: l.order,
        title: t(l.titleKey as never),
        content: l.content,
        goal: l.goal,
        thumbnailUrl: l.thumbnailUrl,
        videoUrl: l.videoUrl,
        lessonHandoutUrl: l.lessonHandoutUrl,
        moduleHandoutUrl: l.moduleHandoutUrl,
      })),
    } as BibleschoolModule;
  });
}

export function useModules(locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.modules(locale),
    queryFn: async () => {
      try {
        return await bibleschoolService.getModules(locale);
      } catch (err) {
        if (__DEV__) console.error('[useModules] Storyblok failed, using fallback:', err);
        return getFallbackModules(t);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: 'always',
    placeholderData: () => getFallbackModules(t),
  });
}

function getFallbackModule(
  moduleId: string,
  t: (key: string) => string,
): BibleschoolModule | null {
  const m = MODULES.find((x) => x.id === moduleId);
  if (!m) return null;
  const lessons = getLessonsForModule(moduleId);
  return {
    id: m.id,
    title: t(m.titleKey as never),
    description: t(m.descriptionKey as never),
    lessonCount: m.lessonCount,
    order: m.order,
    moduleHandoutUrl: m.moduleHandoutUrl,
    lessons: lessons.map((l) => ({
      id: l.id,
      moduleId: l.moduleId,
      order: l.order,
      title: t(l.titleKey as never),
      content: l.content,
      goal: l.goal,
      thumbnailUrl: l.thumbnailUrl,
      videoUrl: l.videoUrl,
      lessonHandoutUrl: l.lessonHandoutUrl,
      moduleHandoutUrl: l.moduleHandoutUrl,
    })),
  } as BibleschoolModule;
}

export function useIntroductionVimeoId(locale: SupportedLocale) {
  return useQuery({
    queryKey: queryKeys.bibleschool.introductionVimeoId(locale),
    queryFn: () => bibleschoolService.getIntroductionVimeoId(locale),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: 'always',
  });
}

export function useModule(moduleId: string | undefined, locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.module(moduleId ?? '', locale),
    queryFn: async () => {
      if (!moduleId) return null;
      try {
        return await bibleschoolService.getModule(moduleId, locale);
      } catch (err) {
        if (__DEV__) console.error('[useModule] Storyblok failed, using fallback:', err);
        return getFallbackModule(moduleId, t);
      }
    },
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: 'always',
    placeholderData: () =>
      moduleId ? getFallbackModule(moduleId, t) : null,
  });
}

function getFallbackLesson(
  moduleId: string,
  lessonId: string,
  t: (key: string) => string,
): BibleschoolLesson | null {
  const lessons = getLessonsForModule(moduleId);
  const l = lessons.find((x) => x.id === lessonId);
  if (!l) return null;
  return {
    id: l.id,
    moduleId: l.moduleId,
    order: l.order,
    title: t(l.titleKey as never),
    content: l.content,
    goal: l.goal,
    thumbnailUrl: l.thumbnailUrl,
    videoUrl: l.videoUrl,
    lessonHandoutUrl: l.lessonHandoutUrl,
    moduleHandoutUrl: l.moduleHandoutUrl,
  } as BibleschoolLesson;
}

export function useLesson(
  moduleId: string | undefined,
  lessonId: string | undefined,
  locale: SupportedLocale,
) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.lesson(
      moduleId ?? '',
      lessonId ?? '',
      locale,
    ),
    queryFn: async () => {
      if (!moduleId || !lessonId) return null;
      try {
        return await bibleschoolService.getLesson(moduleId, lessonId, locale);
      } catch {
        return getFallbackLesson(moduleId, lessonId, t);
      }
    },
    enabled: !!moduleId && !!lessonId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: () =>
      moduleId && lessonId
        ? getFallbackLesson(moduleId, lessonId, t)
        : null,
  });
}
