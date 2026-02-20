import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function FaithBusinessSchoolLayout() {
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
    </Stack>
  );
}
