import {
  rootScreenOptions,
  stackScreenOptions,
} from '@/constants/screenAnimationOptions';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function BibleSchoolTabsLayout() {
  const theme = useTheme();
  const baseOptions = stackScreenOptions({
    headerShown: false,
    contentStyle: { backgroundColor: theme.pageBg },
  });

  return (
    <Stack screenOptions={baseOptions}>
      <Stack.Screen name="index" options={rootScreenOptions({ title: 'Overview' })} />
      <Stack.Screen name="modules" options={{ title: 'Modules' }} />
    </Stack>
  );
}
