import { Box } from '@/components/ui/box';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTopBar } from './_components/MainTopBar';
import { SectionCard } from './_components/SectionCard';

export default function HubScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);

  if (profileLoading && user?.id) {
    return <LoadingScreen message={t('common.loading')} />;
  }

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('navbar.home')}
        currentSection="index"
      />
      <VStack className="gap-6">
        <Text
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: theme.textSecondary }}
        >
          {t('common.faithGeneration')}
        </Text>
        <Text
          className="text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          {t('home.welcome')}{profile?.full_name ? `, ${profile.full_name}` : ''}
        </Text>
        <Text
          className="text-lg font-semibold"
          style={{ color: theme.textPrimary }}
        >
          {t('hub.title')}
        </Text>

        <VStack className="gap-4 mt-2">
          <SectionCard
            icon="school"
            title={t('hub.bibleschool')}
            subtitle={t('hub.bibleschoolSubtitle')}
            onPress={() => router.push('/(main)/bibleschool')}
          />
          <SectionCard
            icon="mic"
            title={t('hub.podcasts')}
            subtitle={t('hub.podcastsSubtitle')}
            onPress={() => router.push('/(main)/podcasts')}
          />
          <SectionCard
            icon="videocam"
            title={t('hub.sermons')}
            subtitle={t('hub.sermonsSubtitle')}
            onPress={() => router.push('/(main)/sermons')}
          />
        </VStack>
      </VStack>
    </Box>
  );
}
