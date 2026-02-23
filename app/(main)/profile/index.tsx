import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { VStack } from '@/components/ui/vstack';
import { SectionCard } from '@/app/(main)/_components/SectionCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { routes } from '@/constants/routes';
import { getProfileReturnHref } from '@/hooks/useLastSectionRestore';
import { router } from 'expo-router';
import { bzzt } from '@/utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id);

  const handleBack = () => {
    getProfileReturnHref().then((href) => {
      if (href && !href.includes('profile')) {
        router.replace(href as never);
      } else {
        router.replace(routes.main() as never);
      }
    });
  };

  if (profileLoading && user?.id) {
    return <LoadingScreen message={t('loading.section.profile')} />;
  }

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: 0,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('navbar.profile')}
        currentSection="profile"
        showBackButton
        onBack={handleBack}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <VStack className="gap-4 items-center">
          <Box
            className="rounded-full w-16 h-16 items-center justify-center"
            style={{ backgroundColor: theme.avatarPrimary }}
          >
            <Ionicons name="person" size={32} color={theme.textSecondary} />
          </Box>
          <Text
            className="text-xl font-bold text-center"
            style={{ color: theme.textPrimary }}
          >
            {profile?.full_name ?? t('navbar.profile')}
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: theme.textSecondary }}
          >
            {profile?.email ?? user?.email ?? ''}
          </Text>

          <VStack className="mt-3 gap-3 w-full">
            <SectionCard
              icon="person-outline"
              title={t('profile.information')}
              subtitle={t('profile.informationSubtitle')}
              onPress={() => router.push(routes.profile('information'))}
              compact
            />
          </VStack>
        </VStack>
      </ScrollView>

      <Box
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: insets.bottom + 24,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            bzzt();
            signOut();
          }}
          activeOpacity={0.7}
          className="rounded-2xl py-3 px-5 cursor-pointer"
          style={{
            backgroundColor: theme.buttonDecline,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HStack className="items-center gap-2">
            <Ionicons name="log-out-outline" size={20} color={theme.buttonDeclineContrast} />
            <Text
              className="text-base font-semibold"
              style={{ color: theme.buttonDeclineContrast }}
            >
              {t('home.signOut')}
            </Text>
          </HStack>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
