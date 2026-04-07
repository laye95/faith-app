import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AuthErrorBoxProps {
  message: string;
}

export function AuthErrorBox({ message }: AuthErrorBoxProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Box
        className="rounded-xl border p-4"
        style={{
          backgroundColor: theme.badgeError,
          borderColor: theme.buttonDecline,
          opacity: 0.9,
        }}
      >
        <HStack className="items-center gap-3">
          <Ionicons
            name="alert-circle"
            size={18}
            color={theme.buttonDecline}
          />
          <Text
            className="flex-1 text-sm"
            style={{ color: theme.textPrimary }}
          >
            {message}
          </Text>
        </HStack>
      </Box>
    </Animated.View>
  );
}

const __expoRouterPrivateRoute_AuthErrorBox = () => null;

export default __expoRouterPrivateRoute_AuthErrorBox;
