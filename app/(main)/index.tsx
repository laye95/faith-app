import { Box } from '@/components/ui/box';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { routes } from '@/constants/routes';
import { APP_VERSION } from '@/constants/version';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { SectionCard } from './_components/SectionCard';

export default function HubScreen() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);

  useEffect(() => {
    if (!profileLoading && user?.id && isAdmin) {
      router.replace(routes.admin());
    }
  }, [profileLoading, user?.id, isAdmin]);

  if (profileLoading && user?.id) {
    return <LoadingScreen message={t('common.loading')} />;
  }

  if (isAdmin) {
    return <LoadingScreen message={t('common.loading')} />;
  }

  return (
    <Box
      className="flex-1"
      style={{
        backgroundColor: theme.pageBg,
      }}
    >
      <Box
        className="px-6"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: 16,
          backgroundColor: theme.pageBg,
        }}
      >
        <MainTopBar
          title={t('navbar.home')}
          currentSection="index"
        />
        <VStack className="gap-6 pt-6">
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
        </VStack>
      </Box>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, flexGrow: 1 }}
      >
        <VStack className="gap-4">
            <SectionCard
              icon="school"
              title={t('hub.bibleschool')}
              subtitle={t('hub.bibleschoolSubtitle')}
              onPress={() => router.push(routes.bibleschool())}
            />
            <SectionCard
              icon="business"
              title={t('hub.faithBusinessSchool')}
              subtitle={t('hub.faithBusinessSchoolSubtitle')}
              onPress={() => router.push(routes.faithBusinessSchool())}
            />
            <SectionCard
              icon="heart"
              title={t('hub.healingSchool')}
              subtitle={t('hub.healingSchoolSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="videocam"
              title={t('hub.sermons')}
              subtitle={t('hub.sermonsSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="mic"
              title={t('hub.podcasts')}
              subtitle={t('hub.podcastsSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="book"
              title={t('hub.bibleVersesLearn')}
              subtitle={t('hub.bibleVersesLearnSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="headset"
              title={t('hub.audiobooks')}
              subtitle={t('hub.audiobooksSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="gift"
              title={t('hub.giving')}
              subtitle={t('hub.givingSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="sparkles"
              title={t('hub.miracles')}
              subtitle={t('hub.miraclesSubtitle')}
              onPress={() => {}}
              disabled
            />
            <SectionCard
              icon="calendar"
              title={t('hub.bibleReadingSchedule')}
              subtitle={t('hub.bibleReadingScheduleSubtitle')}
              onPress={() => {}}
              disabled
            />
        </VStack>
      </ScrollView>
      <Box
        className="items-center px-6"
        style={{
          paddingTop: 12,
          paddingBottom: insets.bottom + 24,
          backgroundColor: theme.pageBg,
        }}
      >
        <Box
          className="px-4 py-2"
          style={{
            backgroundColor: theme.tabInactiveBg,
            borderRadius: 8,
            alignSelf: 'center',
          }}
        >
          <Text
            className="text-xs font-medium"
            style={{ color: theme.textTertiary }}
          >
            {t('app.versionLabel', { version: APP_VERSION })}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
