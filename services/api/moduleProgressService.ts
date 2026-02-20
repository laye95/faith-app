import type {
  CreateModuleProgressInput,
  ModuleProgress,
  ModuleStatus,
  UpdateModuleProgressInput,
} from '@/types/progress';

import { BaseService } from './baseService';

class ModuleProgressService extends BaseService {
  protected tableName = 'user_module_progress';

  async getByUserAndModule(
    userId: string,
    moduleId: string,
  ): Promise<ModuleProgress | null> {
    const rows = await this.list<ModuleProgress>({
      filters: [
        { field: 'user_id', operator: 'eq', value: userId },
        { field: 'module_id', operator: 'eq', value: moduleId },
      ],
    });
    return rows[0] ?? null;
  }

  async upsertByUserAndModule(
    userId: string,
    moduleId: string,
    data: UpdateModuleProgressInput,
  ): Promise<ModuleProgress> {
    const payload: Record<string, unknown> = {
      user_id: userId,
      module_id: moduleId,
    };
    if (data.status !== undefined) payload.status = data.status;
    if (data.progress_percentage !== undefined)
      payload.progress_percentage = data.progress_percentage;
    if (data.completed_at !== undefined) payload.completed_at = data.completed_at;

    return this.upsertWithConflict<ModuleProgress>(payload, {
      onConflict: 'user_id,module_id',
      ignoreDuplicates: false,
    });
  }

  async listByUser(userId: string): Promise<ModuleProgress[]> {
    return this.list<ModuleProgress>({
      filters: [{ field: 'user_id', operator: 'eq', value: userId }],
      sort: [{ field: 'created_at', ascending: true }],
    });
  }

  async createProgress(
    input: CreateModuleProgressInput,
  ): Promise<ModuleProgress> {
    return this.create<ModuleProgress, CreateModuleProgressInput>(input);
  }

  async markCompleted(
    userId: string,
    moduleId: string,
  ): Promise<ModuleProgress> {
    return this.upsertByUserAndModule(userId, moduleId, {
      status: 'completed' as ModuleStatus,
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
    });
  }
}

export const moduleProgressService = new ModuleProgressService();
