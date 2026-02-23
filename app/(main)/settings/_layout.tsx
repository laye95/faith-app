import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="video" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
