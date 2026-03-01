import { BibleschoolTabProvider } from "@/contexts/BibleschoolTabContext";
import { BibleschoolTabBar } from "./_components/BibleschoolTabBar";
import {
  rootScreenOptions,
  stackScreenOptions,
} from "@/constants/screenAnimationOptions";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function BibleSchoolLayout() {
  const theme = useTheme();
  const baseOptions = stackScreenOptions({
    headerShown: false,
    contentStyle: { backgroundColor: theme.pageBg },
  });

  return (
    <BibleschoolTabProvider>
    <View style={{ flex: 1, backgroundColor: theme.pageBg }}>
      <Stack screenOptions={baseOptions}>
        <Stack.Screen name="(tabs)" options={rootScreenOptions()} />
        <Stack.Screen name="intro" />
      </Stack>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <BibleschoolTabBar />
      </View>
    </View>
    </BibleschoolTabProvider>
  );
}
