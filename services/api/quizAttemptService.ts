import type { CreateQuizAttemptInput, QuizAttempt } from '@/types/progress';

import { BaseService } from './baseService';

class QuizAttemptService extends BaseService {
  protected tableName = 'user_quiz_attempts';

  async createAttempt(
    userId: string,
    moduleId: string,
    data: {
      attempt_number: number;
      score_percentage: number;
      passed: boolean;
      answers?: Record<string, string> | null;
      correct_count?: number;
      total_count?: number;
    },
  ): Promise<QuizAttempt> {
    return this.create<QuizAttempt, CreateQuizAttemptInput>({
      user_id: userId,
      module_id: moduleId,
      attempt_number: data.attempt_number,
      score_percentage: data.score_percentage,
      passed: data.passed,
      answers: data.answers ?? null,
      correct_count: data.correct_count,
      total_count: data.total_count,
      completed_at: new Date().toISOString(),
    });
  }

  async listByUserAndModule(
    userId: string,
    moduleId: string,
  ): Promise<QuizAttempt[]> {
    return this.list<QuizAttempt>({
      filters: [
        { field: 'user_id', operator: 'eq', value: userId },
        { field: 'module_id', operator: 'eq', value: moduleId },
      ],
      sort: [{ field: 'attempt_number', ascending: false }],
    });
  }

  async listAllByUser(userId: string): Promise<QuizAttempt[]> {
    return this.list<QuizAttempt>({
      filters: [{ field: 'user_id', operator: 'eq', value: userId }],
      sort: [
        { field: 'module_id', ascending: true },
        { field: 'attempt_number', ascending: false },
      ],
    });
  }
}

export function groupQuizAttemptsByModuleId(
  attempts: QuizAttempt[] | undefined,
): Map<string, QuizAttempt[]> {
  const map = new Map<string, QuizAttempt[]>();
  if (!attempts) return map;
  for (const a of attempts) {
    const list = map.get(a.module_id) ?? [];
    list.push(a);
    map.set(a.module_id, list);
  }
  for (const list of map.values()) {
    list.sort((x, y) => y.attempt_number - x.attempt_number);
  }
  return map;
}

export const quizAttemptService = new QuizAttemptService();
