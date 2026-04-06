import type { User } from '@/types/user';

import { AppError, AppErrorCode, BaseService } from './baseService';

class UserService extends BaseService {
  protected tableName = 'users';

  async getById(id: string): Promise<User> {
    return this.get<User>(id);
  }

  async updateUser(
    id: string,
    updates: {
      full_name?: string;
      phone?: string | null;
      birthdate?: string | null;
      country?: string | null;
      city?: string | null;
    },
  ): Promise<User> {
    return super.update(id, updates);
  }

  async updateAvatarUrl(id: string, avatarUrl: string): Promise<User> {
    return super.update(id, { avatar_url: avatarUrl });
  }
}

export const userService = new UserService();

/**
 * True when the profile row is missing (e.g. PostgREST PGRST116 → DATABASE_NOT_FOUND).
 * Use instead of parsing error messages in UI.
 */
export function isUserProfileNotFoundError(error: unknown): boolean {
  return (
    error instanceof AppError && error.code === AppErrorCode.DATABASE_NOT_FOUND
  );
}
