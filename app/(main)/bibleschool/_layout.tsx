import { BibleschoolTabProvider } from "@/contexts/BibleschoolTabContext";
import { BibleschoolTabBar } from "./_components/BibleschoolTabBar";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function BibleSchoolLayout() {
  const theme = useTheme();

  return (
    <BibleschoolTabProvider>
    <View style={{ flex: 1, backgroundColor: theme.pageBg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.pageBg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="intro" options={{ animation: 'slide_from_right' }} />
      </Stack>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <BibleschoolTabBar />
      </View>
    </View>
    </BibleschoolTabProvider>
  );
}
