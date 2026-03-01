import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useThemePreference } from '@/contexts/ThemeContext';
import { stackScreenOptions } from '@/constants/screenAnimationOptions';

export function ThemeLayout() {
  const { effectiveScheme } = useThemePreference();

  return (
    <GluestackUIProvider mode={effectiveScheme}>
      <NavThemeProvider
        value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack
          screenOptions={stackScreenOptions({
            headerShown: false,
          })}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
      </NavThemeProvider>
    </GluestackUIProvider>
  );
}
