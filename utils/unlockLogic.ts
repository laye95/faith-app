import type { BibleschoolLesson, BibleschoolModule } from '@/types/bibleschool';
import { sortLessonsByOrder, sortModulesByOrder } from '@/utils/bibleschoolCurriculum';

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
  curriculum: BibleschoolModule[],
  moduleId: string,
  lesson: { id: string; moduleId: string; order: number },
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched = true,
): boolean {
  const modulesSorted = sortModulesByOrder(curriculum);
  const moduleIndex = modulesSorted.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) return false;
  const mod = modulesSorted[moduleIndex];
  const lessons = sortLessonsByOrder(mod);

  if (lesson.order === 1) {
    if (moduleIndex === 0) return introVideoWatched;
    const prevModule = modulesSorted[moduleIndex - 1];
    return passedModuleIds.has(prevModule.id);
  }
  const prevLesson = lessons.find((l) => l.order === lesson.order - 1);
  if (!prevLesson) return false;
  return completedLessonIds.has(prevLesson.id);
}

export function isExamUnlocked(
  curriculum: BibleschoolModule[],
  moduleId: string,
  completedLessonIds: Set<string>,
): boolean {
  const mod = curriculum.find((m) => m.id === moduleId);
  if (!mod) return false;
  const lessons = sortLessonsByOrder(mod);
  if (lessons.length === 0) return false;
  return lessons.every((l) => completedLessonIds.has(l.id));
}

export function getNextUnlockedLesson(
  curriculum: BibleschoolModule[],
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched = true,
): { lesson: BibleschoolLesson; module: BibleschoolModule } | null {
  const sorted = sortModulesByOrder(curriculum);
  for (const module of sorted) {
    const lessons = sortLessonsByOrder(module);
    for (const lesson of lessons) {
      if (completedLessonIds.has(lesson.id)) continue;
      if (
        isLessonUnlocked(
          curriculum,
          module.id,
          lesson,
          completedLessonIds,
          passedModuleIds,
          introVideoWatched,
        )
      ) {
        return { lesson, module };
      }
      return null;
    }
  }
  return null;
}

export type NextUnlockedTarget =
  | { type: 'lesson'; lesson: BibleschoolLesson; module: BibleschoolModule }
  | { type: 'exam'; module: BibleschoolModule };

export type CurrentTargetForModule =
  | { type: 'intro' }
  | { type: 'lesson'; lesson: { id: string; moduleId: string; order: number } }
  | { type: 'exam' };

export function getCurrentTargetForModule(
  curriculum: BibleschoolModule[],
  firstModuleId: string | undefined,
  moduleId: string,
  lessons: { id: string; order: number }[],
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched: boolean,
  examUnlocked: boolean,
  examPassed: boolean,
): CurrentTargetForModule | null {
  if (firstModuleId && moduleId === firstModuleId && !introVideoWatched) {
    return { type: 'intro' };
  }
  const allLessonsDone = lessons.length > 0 && lessons.every((l) => completedLessonIds.has(l.id));
  if (allLessonsDone && examUnlocked && !examPassed) {
    return { type: 'exam' };
  }
  for (const lesson of lessons) {
    if (completedLessonIds.has(lesson.id)) continue;
    if (
      isLessonUnlocked(
        curriculum,
        moduleId,
        { ...lesson, moduleId },
        completedLessonIds,
        passedModuleIds,
        introVideoWatched,
      )
    ) {
      return { type: 'lesson', lesson: { ...lesson, moduleId } };
    }
    return null;
  }
  return null;
}

export function getNextUnlockedTarget(
  curriculum: BibleschoolModule[],
  completedLessonIds: Set<string>,
  passedModuleIds: Set<string>,
  introVideoWatched = true,
): NextUnlockedTarget | null {
  const sorted = sortModulesByOrder(curriculum);
  for (const module of sorted) {
    const lessons = sortLessonsByOrder(module);
    const allLessonsDone = lessons.every((l) => completedLessonIds.has(l.id));
    if (!allLessonsDone) {
      for (const lesson of lessons) {
        if (completedLessonIds.has(lesson.id)) continue;
        if (
          isLessonUnlocked(
            curriculum,
            module.id,
            lesson,
            completedLessonIds,
            passedModuleIds,
            introVideoWatched,
          )
        ) {
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
