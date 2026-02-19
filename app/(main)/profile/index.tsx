import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Text } from '@/components/ui/text';
import { MainTopBar } from '../_components/MainTopBar';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
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
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
        }}
      >
      <VStack className="gap-6 items-center">
        <Box
          className="rounded-full w-20 h-20 items-center justify-center"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          <Ionicons name="person" size={40} color={theme.textSecondary} />
        </Box>
        <Text
          className="text-2xl font-bold text-center"
          style={{ color: theme.textPrimary }}
        >
          {profile?.full_name ?? t('navbar.profile')}
        </Text>
        <Text
          className="text-base text-center"
          style={{ color: theme.textSecondary }}
        >
          {profile?.email ?? user?.email ?? ''}
        </Text>

        <VStack className="mt-4 gap-2 w-full">
          <TouchableOpacity
            onPress={() => {
              bzzt();
              router.push('/(main)/profile/information');
            }}
            activeOpacity={0.7}
            className="rounded-2xl py-4 px-6 cursor-pointer"
            style={{
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-3">
                <Ionicons name="person-outline" size={22} color={theme.textPrimary} />
                <Text
                  className="text-base font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {t('profile.information')}
                </Text>
              </HStack>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              bzzt();
              router.push('/(main)/settings');
            }}
            activeOpacity={0.7}
            className="rounded-2xl py-4 px-6 cursor-pointer"
            style={{
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-3">
                <Ionicons name="settings-outline" size={22} color={theme.textPrimary} />
                <Text
                  className="text-base font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  {t('navbar.settings')}
                </Text>
              </HStack>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </HStack>
          </TouchableOpacity>
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
          className="rounded-2xl py-4 px-6 cursor-pointer"
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
