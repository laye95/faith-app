import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

import { CustomTabBar } from '../../_components/CustomTabBar';

export default function BibleSchoolTabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} section="bibleschool" />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Overview' }} />
      <Tabs.Screen name="modules" options={{ title: 'Modules' }} />
    </Tabs>
  );
}
