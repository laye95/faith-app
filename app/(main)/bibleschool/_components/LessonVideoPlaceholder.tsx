import { Box } from '@/components/ui/box';
import type { ThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export function LessonVideoPlaceholder({ theme }: { theme: ThemeColors }) {
  return (
    <Box
      className="w-full items-center justify-center overflow-hidden rounded-2xl"
      style={{
        aspectRatio: 16 / 9,
        backgroundColor: theme.avatarPrimary,
      }}
    >
      <Box
        className="rounded-full p-4 items-center justify-center"
        style={{ backgroundColor: theme.overlayBg }}
      >
        <Ionicons name="play" size={48} color={theme.buttonPrimaryContrast} />
      </Box>
    </Box>
  );
}

const __expoRouterPrivateRoute_LessonVideoPlaceholder = () => null;

export default __expoRouterPrivateRoute_LessonVideoPlaceholder;
