import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { routes } from '@/constants/routes';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { authService } from '@/services/api/authService';
import { getErrorMessage } from '@/utils/errors';
import { bzzt } from '@/utils/haptics';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormScrollView } from '@/components/ui/FormScrollView';
import { AuthBackgroundDecor } from '../_components/AuthBackgroundDecor';
import { AuthHeader } from '../_components/AuthHeader';
import { AuthTopBar } from '../_components/AuthTopBar';

export default function VerifyEmailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const toast = useToast();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = typeof emailParam === 'string' ? emailParam : '';

  const resendMutation = useMutation({
    mutationFn: (e: string) => authService.resendSignupConfirmation(e),
    onSuccess: () => {
      toast.success(t('auth.resendConfirmationSent'));
    },
    onError: (err: unknown) => {
      toast.error(
        getErrorMessage(err, t('auth.resendConfirmationFailed')),
      );
    },
  });

  const gradientColors = [
    theme.pageBg,
    theme.isDark ? theme.cardBg : theme.emptyBg,
  ] as [string, string];

  if (!email.trim()) {
    return <Redirect href={routes.auth('login')} />;
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <AuthBackgroundDecor />
        <AuthTopBar />
        <FormScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Box className="flex-1 justify-center px-6 pt-4 pb-8">
            <Animated.View entering={FadeIn.duration(700)}>
              <AuthHeader
                showLogo
                titleKey="auth.verifyEmailTitle"
                titleClassName="text-center text-xl font-bold tracking-wide px-2"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(750)}>
              <VStack className="mt-6 gap-4">
                <Text
                  className="text-center text-base leading-6"
                  style={{ color: theme.textSecondary }}
                >
                  {t('auth.verifyEmailBody', { email })}
                </Text>
                <Button
                  onPress={() => {
                    bzzt();
                    resendMutation.mutate(email);
                  }}
                  action="primary"
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-full"
                  isDisabled={resendMutation.isPending}
                  accessibilityState={{ busy: resendMutation.isPending }}
                >
                  {resendMutation.isPending && (
                    <ButtonSpinner className="mr-2" />
                  )}
                  <ButtonText
                    className="text-base font-semibold"
                    style={{ color: theme.buttonPrimary }}
                  >
                    {resendMutation.isPending
                      ? t('auth.resendConfirmationSending')
                      : t('auth.resendConfirmationEmail')}
                  </ButtonText>
                </Button>
              </VStack>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).duration(700)}
              className="mt-12 w-full items-center"
            >
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: theme.cardBorder,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  bzzt();
                  router.replace(routes.auth('login'));
                }}
                activeOpacity={0.7}
                className="mt-6"
                accessibilityRole="link"
                accessibilityLabel={t('auth.a11y.goToLogin')}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: theme.buttonPrimary }}
                >
                  {t('auth.signIn')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Box>
        </FormScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
