export interface Module {
  id: string;
  titleKey: string;
  descriptionKey: string;
  lessonCount: number;
  order: number;
  moduleHandoutUrl?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  titleKey: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  content?: string;
  goal?: string;
  lessonHandoutUrl?: string;
  moduleHandoutUrl?: string;
}

export const MODULES: Module[] = [
  { id: 'module-1', titleKey: 'modules.1.title', descriptionKey: 'modules.1.description', lessonCount: 5, order: 1 },
  { id: 'module-2', titleKey: 'modules.2.title', descriptionKey: 'modules.2.description', lessonCount: 5, order: 2 },
  { id: 'module-3', titleKey: 'modules.3.title', descriptionKey: 'modules.3.description', lessonCount: 5, order: 3 },
  { id: 'module-4', titleKey: 'modules.4.title', descriptionKey: 'modules.4.description', lessonCount: 5, order: 4 },
  { id: 'module-5', titleKey: 'modules.5.title', descriptionKey: 'modules.5.description', lessonCount: 5, order: 5 },
  { id: 'module-6', titleKey: 'modules.6.title', descriptionKey: 'modules.6.description', lessonCount: 5, order: 6 },
  { id: 'module-7', titleKey: 'modules.7.title', descriptionKey: 'modules.7.description', lessonCount: 5, order: 7 },
  { id: 'module-8', titleKey: 'modules.8.title', descriptionKey: 'modules.8.description', lessonCount: 5, order: 8 },
  { id: 'module-9', titleKey: 'modules.9.title', descriptionKey: 'modules.9.description', lessonCount: 5, order: 9 },
  { id: 'module-10', titleKey: 'modules.10.title', descriptionKey: 'modules.10.description', lessonCount: 5, order: 10 },
  { id: 'module-11', titleKey: 'modules.11.title', descriptionKey: 'modules.11.description', lessonCount: 5, order: 11 },
  { id: 'module-12', titleKey: 'modules.12.title', descriptionKey: 'modules.12.description', lessonCount: 5, order: 12 },
  { id: 'module-13', titleKey: 'modules.13.title', descriptionKey: 'modules.13.description', lessonCount: 5, order: 13 },
  { id: 'module-14', titleKey: 'modules.14.title', descriptionKey: 'modules.14.description', lessonCount: 5, order: 14 },
  { id: 'module-15', titleKey: 'modules.15.title', descriptionKey: 'modules.15.description', lessonCount: 5, order: 15 },
  { id: 'module-16', titleKey: 'modules.16.title', descriptionKey: 'modules.16.description', lessonCount: 5, order: 16 },
  { id: 'module-17', titleKey: 'modules.17.title', descriptionKey: 'modules.17.description', lessonCount: 5, order: 17 },
  { id: 'module-18', titleKey: 'modules.18.title', descriptionKey: 'modules.18.description', lessonCount: 5, order: 18 },
  { id: 'module-19', titleKey: 'modules.19.title', descriptionKey: 'modules.19.description', lessonCount: 5, order: 19 },
  { id: 'module-20', titleKey: 'modules.20.title', descriptionKey: 'modules.20.description', lessonCount: 5, order: 20 },
];

export const TOTAL_LESSONS = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);

export function getLessonsForModule(moduleId: string): Lesson[] {
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) return [];
  return Array.from({ length: module.lessonCount }, (_, i) => ({
    id: `${moduleId}-lesson-${i + 1}`,
    moduleId,
    order: i + 1,
    titleKey: `lessons.modules.${module.order}.${i + 1}`,
    content: '',
    goal: '',
  }));
}

export function getNextLessonForUser(
  completedLessonIds: Set<string>,
): { lesson: Lesson; module: Module } | null {
  for (const module of MODULES) {
    const lessons = getLessonsForModule(module.id);
    for (const lesson of lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        return { lesson, module };
      }
    }
  }
  return null;
}
