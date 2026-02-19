import type {
  CreateLessonProgressInput,
  LessonProgress,
  UpdateLessonProgressInput,
} from '@/types/progress';

import { BaseService } from './baseService';

class LessonProgressService extends BaseService {
  protected tableName = 'user_lesson_progress';

  async getByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<LessonProgress | null> {
    const rows = await this.list<LessonProgress>({
      filters: [
        { field: 'user_id', operator: 'eq', value: userId },
        { field: 'lesson_id', operator: 'eq', value: lessonId },
      ],
    });
    return rows[0] ?? null;
  }

  async upsertByUserAndLesson(
    userId: string,
    lessonId: string,
    data: UpdateLessonProgressInput & { module_id: string },
  ): Promise<LessonProgress> {
    const payload: Record<string, unknown> = {
      user_id: userId,
      lesson_id: lessonId,
      module_id: data.module_id,
    };
    if (data.completed !== undefined) payload.completed = data.completed;
    if (data.video_position_seconds !== undefined)
      payload.video_position_seconds = data.video_position_seconds;
    if (data.completed_at !== undefined) payload.completed_at = data.completed_at;

    const { data: result, error } = await this.supabase
      .from(this.tableName!)
      .upsert(payload, {
        onConflict: 'user_id,lesson_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw this.normalizeError(error);
    if (!result) throw new Error('No data returned from upsert');
    return result as LessonProgress;
  }

  async listByUserAndModule(
    userId: string,
    moduleId: string,
  ): Promise<LessonProgress[]> {
    return this.list<LessonProgress>({
      filters: [
        { field: 'user_id', operator: 'eq', value: userId },
        { field: 'module_id', operator: 'eq', value: moduleId },
      ],
    });
  }

  async listCompletedByUser(userId: string): Promise<LessonProgress[]> {
    return this.list<LessonProgress>({
      filters: [
        { field: 'user_id', operator: 'eq', value: userId },
        { field: 'completed', operator: 'eq', value: true },
      ],
    });
  }

  async createProgress(
    input: CreateLessonProgressInput,
  ): Promise<LessonProgress> {
    return this.create<LessonProgress, CreateLessonProgressInput>(input);
  }
}

export const lessonProgressService = new LessonProgressService();
