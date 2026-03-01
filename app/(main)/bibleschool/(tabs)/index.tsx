import { Box } from '@/components/ui/box';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { routes } from '@/constants/routes';
import { ContinueLearningCard } from '../_components/ContinueLearningCard';
import { CurrentVideoCard } from '../_components/CurrentVideoCard';
import { ProgressCard } from '../_components/ProgressCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { bibleschoolService } from '@/services/storyblok/bibleschoolService';

export default function BibleSchoolScreen() {
  const { setActiveTab } = useBibleschoolTab();
  const queryClient = useQueryClient();
  const { locale } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      setActiveTab('index');
      queryClient.prefetchQuery({
        queryKey: queryKeys.bibleschool.category(locale),
        queryFn: () => bibleschoolService.getBibleschoolCategory(locale),
      });
    }, [setActiveTab, queryClient, locale])
  );
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['progress'],
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.bibleschool.category(locale),
    });
    setRefreshing(false);
  }, [queryClient, locale]);

  if (profileLoading && user?.id) {
    return <LoadingScreen message={t('loading.section.bibleschool')} />;
  }

  return (
    <Box
      className="flex-1 px-6 pt-6"
      style={{
        paddingTop: insets.top + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('navbar.bibleschool')}
        currentSection="bibleschool"
        showBackButton
        onBack={() => router.replace(routes.main())}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textTertiary}
          />
        }
      >
        <VStack className="gap-6">
          <Text
            className="text-2xl font-bold"
            style={{ color: theme.textPrimary }}
          >
            {t('home.welcome')}{profile?.full_name ? `, ${profile.full_name}` : ''}
          </Text>

          <Text
            className="text-xs font-semibold uppercase tracking-wider mt-4"
            style={{ color: theme.textSecondary }}
          >
            {t('overview.sectionTitle')}
          </Text>
          <VStack className="gap-4">
            <ProgressCard />
            <CurrentVideoCard />
            <ContinueLearningCard />
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
