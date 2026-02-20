import { MODULES } from '@/constants/modules';
import type { QuizQuestion } from '@/types/quiz';

function buildQuestionsForModule(moduleOrder: number): QuizQuestion[] {
  const moduleId = MODULES.find((m) => m.order === moduleOrder)?.id ?? `module-${moduleOrder}`;
  return [
    {
      id: `${moduleId}-q1`,
      moduleId,
      order: 1,
      questionKey: `quiz.modules.${moduleOrder}.questions.1.question`,
      options: [
        { id: 'a', key: `quiz.modules.${moduleOrder}.questions.1.a`, correct: true },
        { id: 'b', key: `quiz.modules.${moduleOrder}.questions.1.b`, correct: false },
        { id: 'c', key: `quiz.modules.${moduleOrder}.questions.1.c`, correct: false },
        { id: 'd', key: `quiz.modules.${moduleOrder}.questions.1.d`, correct: false },
      ],
    },
    {
      id: `${moduleId}-q2`,
      moduleId,
      order: 2,
      questionKey: `quiz.modules.${moduleOrder}.questions.2.question`,
      options: [
        { id: 'a', key: `quiz.modules.${moduleOrder}.questions.2.a`, correct: false },
        { id: 'b', key: `quiz.modules.${moduleOrder}.questions.2.b`, correct: true },
        { id: 'c', key: `quiz.modules.${moduleOrder}.questions.2.c`, correct: false },
        { id: 'd', key: `quiz.modules.${moduleOrder}.questions.2.d`, correct: false },
      ],
    },
    {
      id: `${moduleId}-q3`,
      moduleId,
      order: 3,
      questionKey: `quiz.modules.${moduleOrder}.questions.3.question`,
      options: [
        { id: 'a', key: `quiz.modules.${moduleOrder}.questions.3.a`, correct: false },
        { id: 'b', key: `quiz.modules.${moduleOrder}.questions.3.b`, correct: false },
        { id: 'c', key: `quiz.modules.${moduleOrder}.questions.3.c`, correct: true },
        { id: 'd', key: `quiz.modules.${moduleOrder}.questions.3.d`, correct: false },
      ],
    },
  ];
}

const questionsByModule = new Map<string, QuizQuestion[]>();

MODULES.forEach((m) => {
  questionsByModule.set(m.id, buildQuestionsForModule(m.order));
});

export function getMockQuestionsForModule(moduleId: string): QuizQuestion[] {
  return questionsByModule.get(moduleId) ?? [];
}
