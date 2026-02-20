import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './useUserProfile';

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);

  return profile?.role === 'admin';
}
