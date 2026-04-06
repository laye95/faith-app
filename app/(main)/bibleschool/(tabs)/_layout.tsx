import {
  rootScreenOptions,
  stackScreenOptions,
  STACK_ANIMATION,
} from '@/constants/screenAnimationOptions';
import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function BibleSchoolTabsLayout() {
  const theme = useTheme();
  const { navigationDirection } = useBibleschoolTab();

  const baseOptions = stackScreenOptions({
    headerShown: false,
    contentStyle: { backgroundColor: theme.pageBg },
  });

  const modulesAnimation =
    navigationDirection === 'left' ? STACK_ANIMATION.pop : STACK_ANIMATION.push;

  return (
    <Stack screenOptions={baseOptions}>
      <Stack.Screen name="index" options={rootScreenOptions({ title: 'Overview' })} />
      <Stack.Screen name="modules" options={{ title: 'Modules', animation: modulesAnimation }} />
      <Stack.Screen name="voortgang/index" options={{ title: 'Voortgang' }} />
    </Stack>
  );
}
