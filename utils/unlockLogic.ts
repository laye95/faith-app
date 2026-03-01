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
  introVideoWatched = true,
): boolean {
  if (lesson.order === 1) {
    const moduleIndex = MODULES.findIndex((m) => m.id === moduleId);
    if (moduleIndex === 0) return introVideoWatched;
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
  introVideoWatched = true,
): { lesson: Lesson; module: (typeof MODULES)[0] } | null {
  for (const module of MODULES) {
    const lessons = getLessonsForModule(module.id);
    for (const lesson of lessons) {
      if (completedLessonIds.has(lesson.id)) continue;
      if (isLessonUnlocked(module.id, lesson, completedLessonIds, passedModuleIds, introVideoWatched)) {
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

export type CurrentTargetForModule =
  | { type: 'intro' }
  | { type: 'lesson'; lesson: { id: string; moduleId: string; order: number } }
  | { type: 'exam' };

export function getCurrentTargetForModule(
  moduleId: string,
  lessons: { id: string; order: number }[],
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched: boolean,
  examUnlocked: boolean,
  examPassed: boolean,
): CurrentTargetForModule | null {
  if (moduleId === 'module-1' && !introVideoWatched) {
    return { type: 'intro' };
  }
  const allLessonsDone = lessons.length > 0 && lessons.every((l) => completedLessonIds.has(l.id));
  if (allLessonsDone && examUnlocked && !examPassed) {
    return { type: 'exam' };
  }
  for (const lesson of lessons) {
    if (completedLessonIds.has(lesson.id)) continue;
    if (isLessonUnlocked(moduleId, { ...lesson, moduleId }, completedLessonIds, passedModuleIds, introVideoWatched)) {
      return { type: 'lesson', lesson: { ...lesson, moduleId } };
    }
    return null;
  }
  return null;
}

export function getNextUnlockedTarget(
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched = true,
): NextUnlockedTarget | null {
  for (const module of MODULES) {
    const lessons = getLessonsForModule(module.id);
    const allLessonsDone = lessons.every((l) => completedLessonIds.has(l.id));
    if (!allLessonsDone) {
      for (const lesson of lessons) {
        if (completedLessonIds.has(lesson.id)) continue;
        if (isLessonUnlocked(module.id, lesson, completedLessonIds, passedModuleIds, introVideoWatched)) {
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
