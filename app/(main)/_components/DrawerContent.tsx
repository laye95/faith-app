import { StreakPill } from '@/components/ui/StreakPill';
import { useStreak } from '@/hooks/useStreak';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/contexts/AuthContext';
import { useSectionNavigation } from '@/contexts/SectionNavigationContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { routes } from '@/constants/routes';
import { saveProfileReturnHref } from '@/hooks/useLastSectionRestore';
import { APP_VERSION } from '@/constants/version';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native';

const CONTENT_SECTIONS: Array<{
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  enabled?: boolean;
}> = [
  { name: 'index', icon: 'home', labelKey: 'navbar.home', enabled: true },
  { name: 'bibleschool', icon: 'school', labelKey: 'hub.bibleschool', enabled: true },
  { name: 'faith-business-school', icon: 'business', labelKey: 'hub.faithBusinessSchool', enabled: true },
  { name: 'healing-school', icon: 'heart', labelKey: 'hub.healingSchool', enabled: false },
  { name: 'sermons', icon: 'videocam', labelKey: 'hub.sermons', enabled: false },
  { name: 'podcasts', icon: 'mic', labelKey: 'hub.podcasts', enabled: false },
  { name: 'bible-verses-learn', icon: 'book', labelKey: 'hub.bibleVersesLearn', enabled: false },
  { name: 'audiobooks', icon: 'headset', labelKey: 'hub.audiobooks', enabled: false },
  { name: 'giving', icon: 'gift', labelKey: 'hub.giving', enabled: false },
  { name: 'miracles', icon: 'sparkles', labelKey: 'hub.miracles', enabled: false },
  { name: 'bible-reading-schedule', icon: 'calendar', labelKey: 'hub.bibleReadingSchedule', enabled: false },
];

const ACCOUNT_SECTIONS: Array<{
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  enabled?: boolean;
}> = [{ name: 'profile', icon: 'person', labelKey: 'navbar.profile', enabled: true }];

const ADMIN_SECTIONS: Array<{
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  enabled?: boolean;
}> = [
  { name: 'admin', icon: 'stats-chart', labelKey: 'admin.overview', enabled: true },
  { name: 'admin/analytics', icon: 'school', labelKey: 'admin.analytics', enabled: true },
  { name: 'admin/users', icon: 'people', labelKey: 'admin.users', enabled: true },
  { name: 'profile', icon: 'person', labelKey: 'navbar.profile', enabled: true },
];

const buttonStyle = (theme: ReturnType<typeof useTheme>) => ({
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 10,
  backgroundColor: theme.cardBg,
  borderWidth: 1,
  borderColor: theme.cardBorder,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: theme.isDark ? 0.2 : 0.05,
  shadowRadius: 4,
  elevation: 2,
});

export function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isAdmin = useIsAdmin();
  const { signOut } = useAuth();
  const { days: streakDays } = useStreak();
  const { startSectionNavigation } = useSectionNavigation();
  const { state, navigation } = props;
  const pathname = usePathname();
  const currentRoute = state.routes[state.index]?.name ?? '';
  const currentSection = currentRoute === 'index' ? 'index' : currentRoute.split('/')[0] ?? currentRoute;
  const sections = isAdmin
    ? ADMIN_SECTIONS
    : [...CONTENT_SECTIONS, ...ACCOUNT_SECTIONS];
  const isSectionSelected = (sectionName: string) => {
    if (isAdmin && sectionName.startsWith('admin')) {
      if (sectionName === 'admin') {
        const onAdminIndex = pathname.endsWith('/admin') || pathname.endsWith('/admin/');
        return onAdminIndex && !pathname.includes('/admin/analytics') && !pathname.includes('/admin/users');
      }
      return pathname.includes(sectionName);
    }
    return currentSection === sectionName;
  };

  const handleSectionChange = (section: (typeof CONTENT_SECTIONS)[0] | (typeof ACCOUNT_SECTIONS)[0] | (typeof ADMIN_SECTIONS)[0]) => {
    if (!section.enabled) return;
    bzzt();
    startSectionNavigation(section.name);
    navigation.closeDrawer();
    if (section.name.includes('/')) {
      router.push(routes.admin(section.name.replace('admin/', '')) as never);
    } else {
      const routeName =
        section.name === 'index'
          ? 'index'
          : section.name === 'profile'
            ? 'profile'
            : section.name;
      if (section.name === 'profile') {
        saveProfileReturnHref(pathname || '/(main)').then(() => {
          navigation.navigate(routeName as never);
        });
      } else {
        navigation.navigate(routeName as never);
      }
    }
  };

  return (
    <Box
      className="flex-1"
      style={{
        backgroundColor: theme.pageBg,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
      }}
    >
      <HStack className="items-center justify-between px-4 pb-3">
        <HStack className="items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              bzzt();
              navigation.closeDrawer();
              signOut();
            }}
            activeOpacity={0.7}
            className="items-center justify-center cursor-pointer"
            style={buttonStyle(theme)}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.buttonDecline} />
          </TouchableOpacity>
          <StreakPill days={streakDays} />
        </HStack>
        <TouchableOpacity
          onPress={() => {
            bzzt();
            navigation.closeDrawer();
          }}
          activeOpacity={0.7}
          className="items-center justify-center cursor-pointer"
          style={buttonStyle(theme)}
        >
          <Ionicons name="close" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </HStack>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
      >
        <VStack className="gap-0">
          {sections.map((section, index) => {
            const isSelected = isSectionSelected(section.name);
            const enabled = section.enabled !== false;
            const isFirstAccountSection =
              !isAdmin &&
              section.name === 'profile' &&
              CONTENT_SECTIONS.length > 0;
            return (
              <Box key={section.name}>
                {index > 0 && !isFirstAccountSection && (
                  <Box
                    style={{
                      height: 1,
                      backgroundColor: theme.cardBorder,
                      marginHorizontal: 8,
                    }}
                  />
                )}
                {isFirstAccountSection && (
                  <Box className="pt-4 pb-2 px-4">
                    <Text
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: theme.textTertiary }}
                    >
                      {t('navbar.account')}
                    </Text>
                  </Box>
                )}
                {isFirstAccountSection && (
                  <Box
                    style={{
                      height: 1,
                      backgroundColor: theme.cardBorder,
                      marginHorizontal: 8,
                      marginBottom: 4,
                    }}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSectionChange(section)}
                  disabled={!enabled}
                  className="cursor-pointer"
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    backgroundColor: isSelected
                      ? theme.isDark
                        ? 'rgba(23, 23, 23, 0.3)'
                        : 'rgba(23, 23, 23, 0.08)'
                      : 'transparent',
                    opacity: enabled ? 1 : 0.5,
                  }}
                >
                  <HStack className="items-center gap-3">
                    <Ionicons
                      name={
                        isSelected
                          ? section.icon
                          : (`${section.icon}-outline` as typeof section.icon)
                      }
                      size={22}
                      color={
                        isSelected
                          ? theme.buttonPrimary
                          : theme.textSecondary
                      }
                    />
                    <Text
                      className="flex-1 text-base font-semibold"
                      style={{ color: theme.textPrimary }}
                    >
                      {t(section.labelKey)}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.buttonPrimary}
                      />
                    )}
                  </HStack>
                </TouchableOpacity>
              </Box>
            );
          })}
        </VStack>
      </ScrollView>
      <Box
        className="pt-6 pb-2 items-center"
        style={{
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
