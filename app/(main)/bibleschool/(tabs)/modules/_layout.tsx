import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { useTheme } from '@/hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useCallback } from 'react';

export default function ModulesLayout() {
  const theme = useTheme();
  const { setActiveTab } = useBibleschoolTab();

  useFocusEffect(
    useCallback(() => {
      setActiveTab('modules');
    }, [setActiveTab])
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.pageBg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
