import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { LockOverlay } from '@/components/common/LockOverlay';
import { routes } from '@/constants/routes';
import type { ThemeColors } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring } from 'react-native-reanimated';

export function StartExamCard({
  moduleId,
  theme,
  t,
  isLocked,
  onLockedPress,
}: {
  moduleId: string;
  theme: ThemeColors;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLocked: boolean;
  onLockedPress?: () => void;
}) {
  const cardOpacity = useSharedValue(isLocked ? 0.6 : 1);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    if (!isLocked) {
      cardOpacity.value = withSpring(1, { damping: 18, stiffness: 100 });
      cardScale.value = withDelay(
        2400,
        withSequence(withSpring(1.03, { damping: 15, stiffness: 120 }), withSpring(1, { damping: 15, stiffness: 120 }))
      );
    } else {
      cardOpacity.value = 0.6;
      cardScale.value = 1;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handlePress = () => {
    if (isLocked) {
      onLockedPress?.();
    } else {
      bzzt();
      router.replace(routes.bibleschoolModuleExam(moduleId));
    }
  };

  return (
    <Animated.View style={cardAnimatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="cursor-pointer"
      >
      <Box
        className="rounded-2xl overflow-hidden flex-row items-center p-4"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        }}
      >
        <Box
          className="rounded-xl p-2.5 mr-4 items-center justify-center"
          style={{
            backgroundColor: theme.avatarPrimary,
            position: 'relative',
          }}
        >
          <Ionicons name="document-text" size={24} color={theme.textPrimary} />
          <LockOverlay isLocked={isLocked} variant="thumbnail" />
        </Box>
        <Box className="flex-1 min-w-0">
          <Text
            className="text-base font-semibold"
            style={{ color: theme.textPrimary }}
          >
            {t('exam.takeExam')}
          </Text>
          <Text
            className="text-xs mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            {isLocked ? t('exam.unlockHint') : t('exam.readyHint')}
          </Text>
        </Box>
        {isLocked ? (
          <Animated.View exiting={FadeOut.duration(250)}>
            <Box
              className="flex-row items-center gap-1.5 mr-2 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: theme.cardBorder }}
            >
              <Ionicons name="lock-closed" size={14} color={theme.textSecondary} />
              <Text
                className="text-xs font-semibold"
                style={{ color: theme.textSecondary }}
              >
                {t('lessons.locked')}
              </Text>
            </Box>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(300).delay(100)}>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </Animated.View>
        )}
      </Box>
    </TouchableOpacity>
    </Animated.View>
  );
}

const __expoRouterPrivateRoute_StartExamCard = () => null;

export default __expoRouterPrivateRoute_StartExamCard;
