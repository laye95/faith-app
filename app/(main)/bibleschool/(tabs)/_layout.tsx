import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function BibleSchoolTabsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Overview', animation: 'slide_from_left' }} />
      <Stack.Screen name="modules" options={{ title: 'Modules', animation: 'slide_from_right' }} />
    </Stack>
  );
}
