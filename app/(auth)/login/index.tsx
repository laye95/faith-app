import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { routes } from "@/constants/routes";
import { bzzt } from "@/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormScrollView } from "@/components/ui/FormScrollView";
import { AuthTopBar } from "../_components/AuthTopBar";

import { AuthBackgroundDecor } from "../_components/AuthBackgroundDecor";
import { AuthHeader } from "../_components/AuthHeader";
import { LoginForm } from "./_components/LoginForm";
import { useLogin } from "./_hooks/useLogin";

export default function LoginScreen() {
  const { login, isLoading, error } = useLogin();
  const theme = useTheme();
  const { t } = useTranslation();

  const gradientColors = [
    theme.pageBg,
    theme.isDark ? theme.cardBg : theme.emptyBg,
  ] as [string, string];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <AuthBackgroundDecor />
      <AuthTopBar />
      <FormScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center px-6 pt-4 pb-8">
            <Animated.View entering={FadeIn.duration(700)}>
              <AuthHeader
                showLogo
                titleKey="auth.loginBrandTitle"
                titleClassName="text-center text-xl font-bold tracking-wide px-2"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(750)}>
              <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(700)}
              className="mt-12 w-full items-center"
            >
              <VStack className="w-full items-center gap-4">
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: theme.cardBorder,
                  }}
                />
                <HStack className="items-center gap-2">
                <Text
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {t("auth.noAccount")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    bzzt();
                    router.push(routes.auth('register'));
                  }}
                  activeOpacity={0.7}
                  className="cursor-pointer"
                  accessibilityRole="link"
                  accessibilityLabel={t("auth.a11y.goToRegister")}
                  accessibilityHint={t("auth.a11y.goToRegisterHint")}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: theme.buttonPrimary }}
                  >
                    {t("auth.register")}
                  </Text>
                </TouchableOpacity>
              </HStack>
              </VStack>
            </Animated.View>
        </Box>
      </FormScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}
