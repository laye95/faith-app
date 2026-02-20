import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { SectionNavigationProvider, useSectionNavigation } from '@/contexts/SectionNavigationContext';
import { useLastSectionRestore } from '@/hooks/useLastSectionRestore';
import { useStreak } from '@/hooks/useStreak';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import { DrawerContent } from './_components/DrawerContent';

function MainLayoutContent() {
  const { session } = useAuth();
  const { isNavigating, targetSection } = useSectionNavigation();
  useLastSectionRestore();
  useStreak();
  const { t } = useTranslation();
  const theme = useTheme();

  if (!session) return <Redirect href="/(auth)/login" />;

  const loadingMessage =
    targetSection === 'index'
      ? t('common.loading')
      : targetSection
        ? t(`loading.section.${targetSection}` as any)
        : t('common.loading');

  return (
    <View style={{ flex: 1, backgroundColor: theme.pageBg }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerStyle: { backgroundColor: theme.pageBg },
          swipeEdgeWidth: 80,
          swipeEnabled: true,
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="admin" />
        <Drawer.Screen name="bibleschool" />
        <Drawer.Screen name="podcasts" />
        <Drawer.Screen name="sermons" />
        <Drawer.Screen name="faith-business-school" />
        <Drawer.Screen name="profile" />
        <Drawer.Screen name="settings/index" />
      </Drawer>
      {isNavigating && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <LoadingScreen message={loadingMessage} />
        </View>
      )}
    </View>
  );
}

export default function MainLayout() {
  const { session, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingScreen message={t('common.authenticating')} />;
  }
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <SectionNavigationProvider>
      <MainLayoutContent />
    </SectionNavigationProvider>
  );
}
