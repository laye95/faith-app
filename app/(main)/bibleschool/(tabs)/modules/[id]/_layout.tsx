import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function ModuleLessonsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="exam" />
      <Stack.Screen name="[lessonId]" />
    </Stack>
  );
}
