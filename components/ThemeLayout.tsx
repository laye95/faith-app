import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useThemePreference } from '@/contexts/ThemeContext';

export function ThemeLayout() {
  const { effectiveScheme } = useThemePreference();

  return (
    <GluestackUIProvider mode={effectiveScheme}>
      <NavThemeProvider
        value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(main)"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
      </NavThemeProvider>
    </GluestackUIProvider>
  );
}
