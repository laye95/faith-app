import { BaseService } from './baseService';

export interface UserSettings {
  id: string;
  user_id: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export class UserSettingsService extends BaseService {
  protected tableName = 'user_settings';

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.normalizeError(error);
      }

      return data as UserSettings;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async getSetting<T = unknown>(userId: string, key: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_setting', {
        p_user_id: userId,
        p_setting_key: key,
      });

      if (error) {
        throw this.normalizeError(error);
      }

      return data as T | null;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async setSetting(
    userId: string,
    key: string,
    value: unknown,
  ): Promise<UserSettings> {
    const maxRetries = 3;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const delay = attempt * 200;
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        const { error } = await this.supabase.rpc('set_user_setting', {
          p_user_id: userId,
          p_setting_key: key,
          p_setting_value: value,
        });

        if (error) {
          const errorMessage = (error.message || '').toLowerCase();
          const errorDetails = (error.details || '').toLowerCase();

          const isUserNotFoundError =
            errorMessage.includes('user record not found') ||
            errorMessage.includes('trigger may not have completed') ||
            errorMessage.includes('referenced record not found') ||
            errorDetails.includes('public.users') ||
            errorDetails.includes('user record not found') ||
            error.code === '23503' ||
            error.code === 'PGRST116';

          if (isUserNotFoundError && attempt < maxRetries - 1) {
            this.log(
              'warn',
              `User record not ready (attempt ${attempt + 1}/${maxRetries}), retrying...`,
              {
                userId,
                key,
                errorMessage: error.message,
                errorCode: error.code,
              },
            );
            lastError = error;
            continue;
          }

          const normalizedError = this.normalizeError(error);
          const normalizedMessage = (
            normalizedError.message || ''
          ).toLowerCase();

          if (
            (normalizedMessage.includes('user record not found') ||
              normalizedMessage.includes('trigger may not have completed') ||
              normalizedMessage.includes('referenced record not found') ||
              normalizedError.code === 'DATABASE_NOT_FOUND') &&
            attempt < maxRetries - 1
          ) {
            this.log(
              'warn',
              `User record not ready after normalization (attempt ${attempt + 1}/${maxRetries}), retrying...`,
              {
                userId,
                key,
                normalizedMessage: normalizedError.message,
                errorCode: normalizedError.code,
              },
            );
            lastError = normalizedError;
            continue;
          }

          throw normalizedError;
        }

        const settings = await this.getUserSettings(userId);
        if (!settings) {
          this.log('warn', 'Failed to retrieve settings, but RPC succeeded', {
            userId,
          });
          return {
            id: '',
            user_id: userId,
            settings: { [key]: value },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }

        return settings;
      } catch (error: unknown) {
        const err = error as { message?: string; code?: string };
        const errorMessage = ((err?.message || '') as string).toLowerCase();
        const isUserNotFoundError =
          errorMessage.includes('user record not found') ||
          errorMessage.includes('trigger may not have completed') ||
          errorMessage.includes('referenced record not found') ||
          err?.code === 'DATABASE_NOT_FOUND' ||
          err?.code === '23503';

        if (isUserNotFoundError && attempt < maxRetries - 1) {
          this.log(
            'warn',
            `User record not ready in catch block (attempt ${attempt + 1}/${maxRetries}), retrying...`,
            {
              userId,
              key,
              errorMessage: err?.message,
              errorCode: err?.code,
            },
          );
          lastError = error;
          continue;
        }

        this.log('error', 'Failed to set user setting after retries', {
          userId,
          key,
          error,
          attempt,
        });
        throw this.normalizeError(error);
      }
    }

    this.log('error', 'Failed to set user setting after all retries', {
      userId,
      key,
      lastError,
    });

    const finalError = lastError
      ? this.normalizeError(lastError)
      : new Error('Failed to set user setting after retries');

    const finalErr = finalError as Error & { code?: string };
    const errorMessage = (finalErr.message || '').toLowerCase();
    const isUserNotFoundError =
      errorMessage.includes('user record not found') ||
      errorMessage.includes('trigger may not have completed') ||
      errorMessage.includes('referenced record not found') ||
      finalErr.code === 'DATABASE_NOT_FOUND';

    if (isUserNotFoundError) {
      const userNotFoundError = new Error(
        'User record not found after all retries. Session may be invalid.',
      );
      (userNotFoundError as { code?: string }).code = 'USER_RECORD_NOT_FOUND';
      (userNotFoundError as { requiresLogout?: boolean }).requiresLogout = true;
      throw userNotFoundError;
    }

    throw finalError;
  }
}

export const userSettingsService = new UserSettingsService();
