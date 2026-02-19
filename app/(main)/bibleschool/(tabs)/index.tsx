import { Box } from '@/components/ui/box';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { MainTopBar } from '../../_components/MainTopBar';
import { ContinueLearningCard } from '../_components/ContinueLearningCard';
import { CurrentVideoCard } from '../_components/CurrentVideoCard';
import { ProgressCard } from '../_components/ProgressCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

export default function BibleSchoolScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);

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
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
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
