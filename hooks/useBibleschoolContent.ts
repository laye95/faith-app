import { useQuery } from '@tanstack/react-query';
import type { SupportedLocale } from '@/i18n';
import { bibleschoolService } from '@/services/storyblok/bibleschoolService';
import { queryKeys } from '@/services/queryKeys';
import {
  getFallbackCategory,
  selectLesson,
  selectModule,
} from '@/utils/bibleschoolFallback';
import { useTranslation } from '@/hooks/useTranslation';

const baseOptions = {
  staleTime: 5 * 60 * 1000,
  retry: 1,
  refetchOnMount: 'always' as const,
};

export function useModules(locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.category(locale),
    queryFn: async () => {
      try {
        return await bibleschoolService.getBibleschoolCategory(locale);
      } catch (err) {
        if (__DEV__)
          console.error('[useModules] Storyblok failed, using fallback:', err);
        return getFallbackCategory(t);
      }
    },
    ...baseOptions,
    placeholderData: () => getFallbackCategory(t),
    select: (data) => data.modules,
  });
}

export function useIntroductionVimeoId(locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.category(locale),
    queryFn: async () => {
      try {
        return await bibleschoolService.getBibleschoolCategory(locale);
      } catch (err) {
        if (__DEV__)
          console.error(
            '[useIntroductionVimeoId] Storyblok failed, using fallback:',
            err,
          );
        return getFallbackCategory(t);
      }
    },
    ...baseOptions,
    placeholderData: () => getFallbackCategory(t),
    select: (data) => data.introductionVimeoId,
  });
}

export function useModule(moduleId: string | undefined, locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.category(locale),
    queryFn: async () => {
      try {
        return await bibleschoolService.getBibleschoolCategory(locale);
      } catch (err) {
        if (__DEV__)
          console.error('[useModule] Storyblok failed, using fallback:', err);
        return getFallbackCategory(t);
      }
    },
    ...baseOptions,
    enabled: !!moduleId,
    placeholderData: () => getFallbackCategory(t),
    select: (data) => (moduleId ? selectModule(data, moduleId) : null),
  });
}

export function useLesson(
  moduleId: string | undefined,
  lessonId: string | undefined,
  locale: SupportedLocale,
) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: queryKeys.bibleschool.category(locale),
    queryFn: async () => {
      try {
        return await bibleschoolService.getBibleschoolCategory(locale);
      } catch (err) {
        if (__DEV__)
          console.error('[useLesson] Storyblok failed, using fallback:', err);
        return getFallbackCategory(t);
      }
    },
    ...baseOptions,
    enabled: !!moduleId && !!lessonId,
    placeholderData: () => getFallbackCategory(t),
    select: (data) =>
      moduleId && lessonId
        ? selectLesson(data, moduleId, lessonId)
        : null,
  });
}
