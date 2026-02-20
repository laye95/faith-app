import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { routes } from "@/constants/routes";
import { bzzt } from "@/utils/haptics";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormScrollView } from "@/components/ui/FormScrollView";
import { AuthTopBar } from "../_components/AuthTopBar";

import { AuthHeader } from "../_components/AuthHeader";
import { LoginForm } from "./_components/LoginForm";
import { useLogin } from "./_hooks/useLogin";

export default function LoginScreen() {
  const { login, isLoading, error } = useLogin();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.pageBg }}>
      <AuthTopBar />
      <FormScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 px-6 py-6 justify-center">
            <Animated.View entering={FadeIn.duration(600)}>
              <AuthHeader icon="book" titleKey="auth.welcomeBack" subtitleKey="auth.loginSubtitle" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              className="mt-8 items-center"
            >
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
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: theme.buttonPrimary }}
                  >
                    {t("auth.register")}
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Animated.View>
        </Box>
      </FormScrollView>
    </SafeAreaView>
  );
}
