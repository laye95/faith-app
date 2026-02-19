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
    },
  ): Promise<QuizAttempt> {
    return this.create<QuizAttempt, CreateQuizAttemptInput>({
      user_id: userId,
      module_id: moduleId,
      attempt_number: data.attempt_number,
      score_percentage: data.score_percentage,
      passed: data.passed,
      answers: data.answers ?? null,
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
}

export const quizAttemptService = new QuizAttemptService();
