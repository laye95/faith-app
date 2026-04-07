import { supabase } from '@/services/supabase/client';
import { isUserProfileNotFoundError, userService } from '@/services/api/userService';
import type { Session } from '@supabase/supabase-js';

export const POST_SIGNUP_PROFILE_MAX_ATTEMPTS = 20;

export const POST_SIGNUP_PROFILE_RETRY_DELAY_MS = 250;

export const POST_SIGNUP_UPDATE_PROFILE_MAX_ATTEMPTS = 5;

export const POST_SIGNUP_SESSION_RESOLVE_ATTEMPTS = 8;

export const POST_SIGNUP_SESSION_RESOLVE_DELAY_MS = 150;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForUserProfileRow(userId: string): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < POST_SIGNUP_PROFILE_MAX_ATTEMPTS; attempt++) {
    try {
      await userService.getById(userId);
      return;
    } catch (e) {
      lastError = e;
      if (
        isUserProfileNotFoundError(e) &&
        attempt < POST_SIGNUP_PROFILE_MAX_ATTEMPTS - 1
      ) {
        await sleep(POST_SIGNUP_PROFILE_RETRY_DELAY_MS);
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

export async function updateUserProfileAfterSignUp(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string | null;
    birthdate?: string | null;
    country?: string | null;
    city?: string | null;
  },
): Promise<void> {
  for (let attempt = 0; attempt < POST_SIGNUP_UPDATE_PROFILE_MAX_ATTEMPTS; attempt++) {
    try {
      await userService.updateUser(userId, updates);
      return;
    } catch (e) {
      if (
        isUserProfileNotFoundError(e) &&
        attempt < POST_SIGNUP_UPDATE_PROFILE_MAX_ATTEMPTS - 1
      ) {
        await sleep(POST_SIGNUP_PROFILE_RETRY_DELAY_MS);
        continue;
      }
      throw e;
    }
  }
}

export async function resolveSessionAfterSignUp(
  sessionFromSignUp: Session | null | undefined,
): Promise<Session | null> {
  if (sessionFromSignUp) {
    return sessionFromSignUp;
  }
  for (let attempt = 0; attempt < POST_SIGNUP_SESSION_RESOLVE_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await sleep(POST_SIGNUP_SESSION_RESOLVE_DELAY_MS);
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      return data.session;
    }
  }
  return null;
}
