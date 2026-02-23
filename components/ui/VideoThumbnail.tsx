import { Box } from '@/components/ui/box';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  isLoading?: boolean;
  width?: number;
  height?: number;
  showPlayIcon?: boolean;
}

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 68;

export function VideoThumbnail({
  thumbnailUrl,
  isLoading,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showPlayIcon = true,
}: VideoThumbnailProps) {
  const theme = useTheme();

  return (
    <Box
      className="rounded-xl overflow-hidden items-center justify-center"
      style={{
        width,
        height,
        position: 'relative' as const,
        backgroundColor: theme.avatarPrimary,
      }}
    >
      {thumbnailUrl ? (
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width, height }}
          contentFit="cover"
        />
      ) : isLoading ? (
        <ActivityIndicator size="small" color={theme.textTertiary} />
      ) : null}
      {showPlayIcon && (
        <Box
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <Box className="rounded-full p-2 items-center justify-center">
            <Ionicons name="play" size={18} color="#ffffff" />
          </Box>
        </Box>
      )}
    </Box>
  );
}
