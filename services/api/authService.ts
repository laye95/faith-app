import { AuthError } from '@supabase/supabase-js';

import { AppError, AppErrorCode } from './baseService';
import { supabase } from '@/services/supabase/client';
import type { LoginData, RegisterData } from '@/types/auth';

function normalizeAuthError(error: AuthError): AppError {
  const message = error.message || 'Authentication error';

  if (error.status === 400) {
    if (message.includes('already registered')) {
      return new AppError(
        'This email is already registered',
        AppErrorCode.AUTH_USER_EXISTS,
        error,
      );
    }
    if (message.includes('Invalid login credentials')) {
      return new AppError(
        'Invalid email or password',
        AppErrorCode.AUTH_INVALID_CREDENTIALS,
        error,
      );
    }
    if (message.includes('Password')) {
      return new AppError(
        'Password is too weak',
        AppErrorCode.AUTH_WEAK_PASSWORD,
        error,
      );
    }
  }

  if (error.status === 429) {
    return new AppError(
      'Too many attempts. Please try again later',
      AppErrorCode.RATE_LIMIT,
      error,
    );
  }

  return new AppError(message, AppErrorCode.UNKNOWN, error);
}

export const authService = {
  getClient() {
    return supabase;
  },

  async login(data: LoginData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      if (error) throw error;
      if (!authData.user) throw new Error('Login failed');
      return authData;
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        'message' in err
      ) {
        throw normalizeAuthError(err as AuthError);
      }
      throw err;
    }
  },

  async signUp(data: RegisterData) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: data.fullName ? { full_name: data.fullName } : undefined,
        },
      });
      if (error) throw error;
      if (!authData.user) throw new Error('Failed to create user');
      return authData;
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        'message' in err
      ) {
        throw normalizeAuthError(err as AuthError);
      }
      throw err;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
