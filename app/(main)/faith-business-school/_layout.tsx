import { stackScreenOptions } from '@/constants/screenAnimationOptions';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function FaithBusinessSchoolLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={stackScreenOptions({
        headerShown: false,
        contentStyle: { backgroundColor: theme.pageBg },
      })}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
