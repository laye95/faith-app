import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function BibleSchoolLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="lesson/[moduleId]/[lessonId]" />
    </Stack>
  );
}
