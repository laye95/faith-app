import { MODULES, getLessonsForModule, type Lesson } from '@/constants/modules';

const EXAM_PASS_FRACTION = 2 / 3;

export function didPassExam(
  correctCount: number,
  totalQuestions: number,
): boolean {
  if (totalQuestions === 0) return false;
  const minRequired = Math.ceil(totalQuestions * EXAM_PASS_FRACTION);
  return correctCount >= minRequired;
}

export function getMinCorrectRequired(totalQuestions: number): number {
  return Math.ceil(totalQuestions * EXAM_PASS_FRACTION);
}

export function isLessonUnlocked(
  moduleId: string,
  lesson: { id: string; moduleId: string; order: number },
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
): boolean {
  if (lesson.order === 1) {
    const moduleIndex = MODULES.findIndex((m) => m.id === moduleId);
    if (moduleIndex === 0) return true;
    const prevModule = MODULES[moduleIndex - 1];
    return passedModuleIds.has(prevModule.id);
  }
  const lessons = getLessonsForModule(moduleId);
  const prevLesson = lessons.find((l) => l.order === lesson.order - 1);
  if (!prevLesson) return false;
  return completedLessonIds.has(prevLesson.id);
}

export function isExamUnlocked(
  moduleId: string,
  completedLessonIds: Set<string>,
): boolean {
  const lessons = getLessonsForModule(moduleId);
  return lessons.every((l) => completedLessonIds.has(l.id));
}

export function getNextUnlockedLesson(
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
): { lesson: Lesson; module: (typeof MODULES)[0] } | null {
  for (const module of MODULES) {
    const lessons = getLessonsForModule(module.id);
    for (const lesson of lessons) {
      if (completedLessonIds.has(lesson.id)) continue;
      if (isLessonUnlocked(module.id, lesson, completedLessonIds, passedModuleIds)) {
        return { lesson, module };
      }
      return null;
    }
  }
  return null;
}

export type NextUnlockedTarget =
  | { type: 'lesson'; lesson: Lesson; module: (typeof MODULES)[0] }
  | { type: 'exam'; module: (typeof MODULES)[0] };

export function getNextUnlockedTarget(
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
): NextUnlockedTarget | null {
  for (const module of MODULES) {
    const lessons = getLessonsForModule(module.id);
    const allLessonsDone = lessons.every((l) => completedLessonIds.has(l.id));
    if (!allLessonsDone) {
      for (const lesson of lessons) {
        if (completedLessonIds.has(lesson.id)) continue;
        if (isLessonUnlocked(module.id, lesson, completedLessonIds, passedModuleIds)) {
          return { type: 'lesson', lesson, module };
        }
        return null;
      }
    }
    if (!passedModuleIds.has(module.id)) {
      return { type: 'exam', module };
    }
  }
  return null;
}
