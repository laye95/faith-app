import { MODULES, getLessonsForModule } from '@/constants/modules';
import type {
  BibleschoolCategory,
  BibleschoolLesson,
  BibleschoolModule,
} from '@/types/bibleschool';

const INTRO_VIDEO_FALLBACK_ID = '927139225';

export function getFallbackCategory(
  t: (key: string) => string,
): BibleschoolCategory {
  const modules: BibleschoolModule[] = MODULES.map((m) => {
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
  return { modules, introductionVimeoId: INTRO_VIDEO_FALLBACK_ID };
}

export function selectModule(
  category: BibleschoolCategory,
  moduleId: string,
): BibleschoolModule | null {
  return category.modules.find((m) => m.id === moduleId) ?? null;
}

export function selectLesson(
  category: BibleschoolCategory,
  moduleId: string,
  lessonId: string,
): BibleschoolLesson | null {
  const mod = selectModule(category, moduleId);
  if (!mod) return null;
  return mod.lessons.find((l) => l.id === lessonId) ?? null;
}