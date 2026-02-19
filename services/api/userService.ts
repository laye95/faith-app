import type { User } from '@/types/user';

import { BaseService } from './baseService';

class UserService extends BaseService {
  protected tableName = 'users';

  async getById(id: string): Promise<User> {
    return this.get<User>(id);
  }

  async updateUser(
    id: string,
    updates: { full_name?: string },
  ): Promise<User> {
    return super.update<User, { full_name?: string }>(id, updates);
  }
}

export const userService = new UserService();
