import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export function LessonVideoLoadError({
  theme,
  message,
  onRetry,
}: {
  theme: ThemeColors;
  message: string;
  onRetry: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onRetry}
      className="rounded-2xl overflow-hidden p-8 items-center justify-center"
      style={{
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
      }}
    >
      <Ionicons
        name="refresh-circle-outline"
        size={48}
        style={{ color: theme.textSecondary, marginBottom: 12 }}
      />
      <Text
        className="text-base font-medium text-center"
        style={{ color: theme.textPrimary }}
      >
        {message}
      </Text>
    </TouchableOpacity>
  );
}

const __expoRouterPrivateRoute_LessonVideoLoadError = () => null;

export default __expoRouterPrivateRoute_LessonVideoLoadError;
