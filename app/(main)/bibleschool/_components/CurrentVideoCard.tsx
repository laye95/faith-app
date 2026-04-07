import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { useLastWatchedLesson } from '@/hooks/useLastWatchedLesson';
import { useIntroductionVimeoId, useModules } from '@/hooks/useBibleschoolContent';
import { useIntroVideoWatched } from '@/hooks/useIntroVideoWatched';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useVimeoThumbnail } from '@/hooks/useVimeoThumbnail';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { routes } from '@/constants/routes';
import { router } from 'expo-router';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { bzzt } from '@/utils/haptics';
import { sortLessonsByOrder, sortModulesByOrder } from '@/utils/bibleschoolCurriculum';
import { useMemo } from 'react';
import { OverviewCard } from './OverviewCard';

export function CurrentVideoCard() {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const { setActiveTab } = useBibleschoolTab();
  const { lesson, module, isLoading } = useLastWatchedLesson();
  const { hasWatched: introWatched, isLoading: introLoading } =
    useIntroVideoWatched();
  const { data: introductionVimeoId } = useIntroductionVimeoId(locale);
  const { data: modules = [] } = useModules(locale);
  const curriculum = useMemo(() => sortModulesByOrder(modules), [modules]);
  const firstModule = curriculum[0];
  const fallbackLesson = firstModule ? sortLessonsByOrder(firstModule)[0] : undefined;
  const fallbackModule = firstModule;
  const targetLesson = lesson ?? fallbackLesson;
  const targetModule = module ?? fallbackModule;

  const showIntro = !lesson && !introWatched;

  const introThumbnailId = showIntro ? introductionVimeoId : undefined;
  const lessonThumbId =
    targetLesson &&
    !targetLesson.thumbnailUrl &&
    'videoId' in targetLesson &&
    targetLesson.videoId
      ? targetLesson.videoId
      : undefined;
  const videoIdForThumb = showIntro ? introThumbnailId : lessonThumbId;
  const { data: vimeoThumbnail, isLoading: thumbnailLoading } =
    useVimeoThumbnail(videoIdForThumb);
  const thumbnailUrl = showIntro
    ? vimeoThumbnail
    : targetLesson?.thumbnailUrl ?? vimeoThumbnail ?? undefined;

  const moduleName = targetModule?.title ?? '';
  const lessonName = showIntro
    ? t('overview.introVideoTitle')
    : targetLesson?.title ?? '';

  const subtitle = isLoading || introLoading
    ? t('overview.currentVideoPlaceholder')
    : showIntro
      ? t('overview.introVideoSubtitle')
      : lesson && module
        ? t('overview.currentVideoContext', { moduleName })
        : t('overview.startFirstLesson');

  const handlePress = () => {
    bzzt();
    if (showIntro) {
      setActiveTab('modules');
      router.push(routes.bibleschoolIntro());
    } else if (targetModule && targetLesson) {
      setActiveTab('modules');
      router.push(routes.bibleschoolModuleLesson(targetModule.id, targetLesson.id));
    }
  };

  return (
    <OverviewCard>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        disabled={!showIntro && (isLoading || !targetLesson || !targetModule)}
        className="cursor-pointer"
        style={{ opacity: !showIntro && isLoading ? 0.7 : 1 }}
      >
        <Box
          className="aspect-video items-center justify-center overflow-hidden"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : videoIdForThumb && thumbnailLoading ? (
            <ActivityIndicator size="large" color={theme.textTertiary} />
          ) : null}
          <Box
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <Box
              className="rounded-full p-4"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <Ionicons name="play" size={40} color="#FFFFFF" />
            </Box>
          </Box>
        </Box>
        <Box className="p-5">
          <Text
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: theme.textTertiary }}
          >
            {t('overview.currentVideoTitle')}
          </Text>
          <Text
            className="text-base font-semibold mb-0.5"
            style={{ color: theme.textPrimary }}
          >
            {lessonName}
          </Text>
          <Text
            className="text-sm mb-3"
            style={{ color: theme.textSecondary }}
          >
            {subtitle}
          </Text>
          <HStack className="items-center gap-2">
            <Ionicons name="play-circle" size={18} color={theme.buttonPrimary} />
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.buttonPrimary }}
            >
              {t('overview.continueWatching')}
            </Text>
          </HStack>
        </Box>
      </TouchableOpacity>
    </OverviewCard>
  );
}

const __expoRouterPrivateRoute_CurrentVideoCard = () => null;

export default __expoRouterPrivateRoute_CurrentVideoCard;
