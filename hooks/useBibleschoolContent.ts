import { useQuery } from '@tanstack/react-query';
import type { SupportedLocale } from '@/i18n';
import { bibleschoolService } from '@/services/storyblok/bibleschoolService';
import { queryKeys } from '@/services/queryKeys';
import type { BibleschoolCategory } from '@/types/bibleschool';
import {
  getFallbackCategory,
  selectLesson,
  selectModule,
} from '@/utils/bibleschoolFallback';
import { useTranslation } from '@/hooks/useTranslation';

const baseOptions = {
  staleTime: 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
  retry: 1,
};

export function getBibleschoolCategoryQueryOptions(
  locale: SupportedLocale,
  t: (key: string) => string,
) {
  return {
    queryKey: queryKeys.bibleschool.category(locale),
    queryFn: async (): Promise<BibleschoolCategory> => {
      try {
        return await bibleschoolService.getBibleschoolCategory(locale);
      } catch (err) {
        console.error('[Storyblok] bibleschool category fetch failed', {
          locale,
          error: err,
        });
        throw err;
      }
    },
    ...baseOptions,
    placeholderData: (): BibleschoolCategory => getFallbackCategory(t),
  };
}

export function useBibleschoolCategoryQuery(locale: SupportedLocale) {
  const { t } = useTranslation();
  return useQuery(getBibleschoolCategoryQueryOptions(locale, t));
}

export function useModules(locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    ...getBibleschoolCategoryQueryOptions(locale, t),
    select: (data: BibleschoolCategory) => data.modules,
  });
}

export function useIntroductionVimeoId(locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    ...getBibleschoolCategoryQueryOptions(locale, t),
    select: (data: BibleschoolCategory) => data.introductionVimeoId,
  });
}

export function useModule(moduleId: string | undefined, locale: SupportedLocale) {
  const { t } = useTranslation();

  return useQuery({
    ...getBibleschoolCategoryQueryOptions(locale, t),
    enabled: !!moduleId,
    select: (data: BibleschoolCategory) =>
      moduleId ? selectModule(data, moduleId) : null,
  });
}

export function useLesson(
  moduleId: string | undefined,
  lessonId: string | undefined,
  locale: SupportedLocale,
) {
  const { t } = useTranslation();

  return useQuery({
    ...getBibleschoolCategoryQueryOptions(locale, t),
    enabled: !!moduleId && !!lessonId,
    select: (data: BibleschoolCategory) =>
      moduleId && lessonId
        ? selectLesson(data, moduleId, lessonId)
        : null,
  });
}
