import { Box } from '@/components/ui/box';
import type { ThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native';

export const NEXT_THUMBNAIL_WIDTH = 120;
export const NEXT_THUMBNAIL_HEIGHT = 68;

export function NextLessonThumbnail({
  thumbnailUrl,
  theme,
  isLoading,
}: {
  thumbnailUrl?: string;
  theme: ThemeColors;
  isLoading?: boolean;
}) {
  return (
    <Box
      className="rounded-xl overflow-hidden items-center justify-center"
      style={{
        width: NEXT_THUMBNAIL_WIDTH,
        height: NEXT_THUMBNAIL_HEIGHT,
        backgroundColor: theme.avatarPrimary,
      }}
    >
      {thumbnailUrl ? (
        <Image
          key={thumbnailUrl}
          source={{ uri: thumbnailUrl }}
          style={{ width: NEXT_THUMBNAIL_WIDTH, height: NEXT_THUMBNAIL_HEIGHT }}
          contentFit="cover"
        />
      ) : isLoading ? (
        <ActivityIndicator size="small" color={theme.textTertiary} />
      ) : null}
      <Box
        className="absolute inset-0 items-center justify-center"
        pointerEvents="none"
      >
        <Box className="rounded-full p-2 items-center justify-center">
          <Ionicons name="play" size={18} color="#ffffff" />
        </Box>
      </Box>
    </Box>
  );
}
