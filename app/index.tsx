import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const { session, isLoading: authLoading, user, signOut } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const userId = user?.id ?? session?.user?.id;
  const {
    data: profile,
    isLoading: profileLoading,
    isFetching,
    error: profileError,
  } = useUserProfile(userId);

  useEffect(() => {
    const handleProfileNotFound = async () => {
      if (!profileError || !session) return;

      const errorMessage = (profileError?.message ?? '').toLowerCase();
      const isNotFound =
        errorMessage.includes('record') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('pgrst116');

      if (isNotFound) {
        try {
          await signOut();
        } finally {
          router.replace('/');
        }
      }
    };

    handleProfileNotFound();
  }, [profileError, session, signOut, router]);

  if (authLoading) {
    return <LoadingScreen message={t('common.authenticating')} />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (session && (profileLoading || isFetching)) {
    return <LoadingScreen message={t('common.loading')} />;
  }

  const errorMessage = (profileError?.message ?? '').toLowerCase();
  const errorCode =
    profileError && 'code' in profileError
      ? (profileError as { code?: string }).code
      : undefined;
  const isProfileNotFound =
    errorMessage.includes('record') ||
    errorMessage.includes('not found') ||
    errorCode === 'PGRST116';

  if (isProfileNotFound) {
    return <LoadingScreen message={t('common.redirecting')} />;
  }

  if (!profile) {
    return <LoadingScreen message={t('common.settingUp')} />;
  }

  return <Redirect href="/(main)" />;
}
