import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VideoThumbnail } from '@/components/ui/VideoThumbnail';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { routes } from '@/constants/routes';
import { useVimeoThumbnail } from '@/hooks/useVimeoThumbnail';
import { TouchableOpacity } from 'react-native';

function IntroRowThumbnail({ introductionVimeoId }: { introductionVimeoId: string }) {
  const { data: vimeoThumbnail, isLoading } = useVimeoThumbnail(introductionVimeoId);
  return (
    <VideoThumbnail
      thumbnailUrl={vimeoThumbnail ?? undefined}
      isLoading={isLoading}
    />
  );
}

interface IntroVideoRowProps {
  introductionVimeoId: string;
  showWatchedCheck?: boolean;
  introWatched?: boolean;
}

export function IntroVideoRow({
  introductionVimeoId,
  showWatchedCheck,
  introWatched,
}: IntroVideoRowProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => {
        bzzt();
        router.push(routes.bibleschoolIntro());
      }}
      activeOpacity={0.7}
      className="cursor-pointer"
    >
      <Box
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        }}
      >
        <Box className="flex-row items-center py-3 pr-4">
          <Box className="pl-3 mr-4">
            <IntroRowThumbnail introductionVimeoId={introductionVimeoId} />
          </Box>
          <Box className="flex-1 justify-center min-w-0">
            <Text
              className="text-base font-medium"
              style={{ color: theme.textPrimary }}
              numberOfLines={2}
            >
              {t('overview.introVideoTitle')}
            </Text>
            <Text
              className="text-xs font-medium mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {t('overview.introVideoSubtitle')}
            </Text>
          </Box>
          {showWatchedCheck && introWatched ? (
            <Ionicons name="checkmark-circle" size={22} color={theme.quizCorrect} />
          ) : null}
          <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
