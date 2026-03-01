import type { User } from '@/types/user';

import { BaseService } from './baseService';

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
}

export const userService = new UserService();
