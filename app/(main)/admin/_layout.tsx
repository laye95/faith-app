import { stackScreenOptions } from '@/constants/screenAnimationOptions';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={stackScreenOptions({ headerShown: false })}>
      <Stack.Screen name="index" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="users" />
      <Stack.Screen name="users/[id]" />
    </Stack>
  );
}
