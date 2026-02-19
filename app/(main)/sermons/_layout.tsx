import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

import { CustomTabBar } from '../_components/CustomTabBar';

export default function SermonsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} section="sermons" />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Latest' }} />
    </Tabs>
  );
}
