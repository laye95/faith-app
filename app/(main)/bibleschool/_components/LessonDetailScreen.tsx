import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useModule, useModules } from '@/hooks/useBibleschoolContent';
import { useNetworkQuality } from '@/hooks/useNetworkQuality';
import { useVimeoPlaybackUrl } from '@/hooks/useVimeoPlaybackUrl';
import { useVimeoThumbnail } from '@/hooks/useVimeoThumbnail';
import { useLessonUnlocks } from '@/hooks/useLessonUnlocks';
import type { BibleschoolLesson } from '@/types/bibleschool';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent, useEventListener } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import { routes } from '@/constants/routes';
import { useNavigation, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { lessonProgressService } from '@/services/api/lessonProgressService';
import { moduleProgressService } from '@/services/api/moduleProgressService';
import { checkAndAwardBadges } from '@/services/api/badgeService';
import { queryKeys } from '@/services/queryKeys';
import { bzzt, bzztWarning } from '@/utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  AppState,
  type AppStateStatus,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { LockedLessonModal } from '@/app/(main)/bibleschool/(tabs)/modules/[id]/_components/LockedLessonModal';
import { LockOverlay } from '@/components/common/LockOverlay';

interface LessonVideoPlayerProps {
  videoUrl: string;
  initialPositionSeconds: number;
  onSavePosition: (seconds: number, immediate?: boolean) => void;
  onMarkComplete?: () => void;
  pipRef?: React.MutableRefObject<{
    start: () => void;
    stop: () => void;
    onPiPStop: (() => void) | null;
  } | null>;
}

function LessonVideoPlayer({
  videoUrl,
  initialPositionSeconds,
  onSavePosition,
  onMarkComplete,
  pipRef,
}: LessonVideoPlayerProps) {
  const videoViewRef = useRef<VideoView>(null);
  const lastPositionRef = useRef(initialPositionSeconds);
  const onSavePositionRef = useRef(onSavePosition);
  const onMarkCompleteRef = useRef(onMarkComplete);
  const hasAppliedInitialSeekRef = useRef(false);
  const hasMarkedCompleteRef = useRef(false);
  onSavePositionRef.current = onSavePosition;
  onMarkCompleteRef.current = onMarkComplete;

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 2;
    p.staysActiveInBackground = true;
    if (initialPositionSeconds > 0) {
      p.currentTime = initialPositionSeconds;
    }
    p.play();
  });

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    lastPositionRef.current = currentTime;
    onSavePositionRef.current(currentTime, false);
    if (onMarkCompleteRef.current && !hasMarkedCompleteRef.current) {
      const duration = player.duration;
      if (duration > 0 && currentTime / duration >= 0.9) {
        hasMarkedCompleteRef.current = true;
        onMarkCompleteRef.current();
      }
    }
  });

  useEventListener(player, 'playToEnd', () => {
    if (onMarkCompleteRef.current && !hasMarkedCompleteRef.current) {
      hasMarkedCompleteRef.current = true;
      onMarkCompleteRef.current();
    }
  });

  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    if (!isPlaying) {
      const pos = player.currentTime;
      lastPositionRef.current = pos;
      onSavePositionRef.current(pos, true);
    }
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEventListener(player, 'statusChange', ({ status: s }) => {
    if (
      s === 'readyToPlay' &&
      initialPositionSeconds > 0 &&
      !hasAppliedInitialSeekRef.current
    ) {
      hasAppliedInitialSeekRef.current = true;
      player.currentTime = initialPositionSeconds;
    }
  });

  useEffect(() => {
    if (initialPositionSeconds > 0 && !hasAppliedInitialSeekRef.current) {
      hasAppliedInitialSeekRef.current = true;
      player.currentTime = initialPositionSeconds;
    }
  }, [initialPositionSeconds]);

  const safeStopPiP = useCallback(() => {
    try {
      const result = videoViewRef.current?.stopPictureInPicture?.();
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        (result as Promise<unknown>).catch(() => {});
      }
    } catch (_) {}
  }, []);

  const safeStartPiP = useCallback(() => {
    try {
      const result = videoViewRef.current?.startPictureInPicture?.();
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        (result as Promise<unknown>).catch(() => {});
      }
    } catch (_) {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        safeStopPiP();
        try {
          player.pause();
        } catch (_) {}
        onSavePositionRef.current(lastPositionRef.current, true);
      };
    }, [player, safeStopPiP]),
  );

  useEffect(() => {
    if (pipRef) {
      pipRef.current = {
        start: safeStartPiP,
        stop: safeStopPiP,
        onPiPStop: null,
      };
      return () => {
        pipRef.current = null;
      };
    }
  }, [pipRef, safeStartPiP, safeStopPiP]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'inactive' || state === 'background') {
        requestAnimationFrame(safeStartPiP);
      }
      if (state === 'active') {
        safeStopPiP();
        try {
          player.play();
        } catch (_) {}
      }
    });
    return () => sub.remove();
  }, [player, safeStartPiP, safeStopPiP]);

  const isLoading = status === 'loading' || status === 'idle';
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setShowLoader(true), 400);
      return () => clearTimeout(t);
    }
    setShowLoader(false);
  }, [isLoading]);

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <VideoView
        ref={videoViewRef}
        style={{ width: '100%', height: '100%' }}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
        startsPictureInPictureAutomatically={true}
        contentFit="contain"
        onPictureInPictureStop={() => pipRef?.current?.onPiPStop?.()}
      />
      {isLoading && showLoader && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(200)}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
            } as const,
          ]}
        >
          <ActivityIndicator size="small" color="#e5e5e5" />
        </Animated.View>
      )}
    </View>
  );
}

function NextLessonPreloader({ videoUrl }: { videoUrl: string }) {
  const source = { uri: videoUrl, useCaching: true };
  useVideoPlayer(source, (p) => {
    p.pause();
  });
  return null;
}

function LessonVideoPlaceholder({ theme }: { theme: ReturnType<typeof useTheme> }) {
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

function HandoutButton({
  label,
  theme,
  onPress,
  disabled,
}: {
  label: string;
  theme: ReturnType<typeof useTheme>;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className="cursor-pointer"
    >
      <Box
        className="flex-row items-center gap-3 px-5 py-4 rounded-2xl"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Box
          className="rounded-xl p-2.5"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          <Ionicons name="document-text" size={24} color={theme.textPrimary} />
        </Box>
        <Text
          className="text-base font-medium flex-1"
          style={{ color: theme.textPrimary }}
        >
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
      </Box>
    </TouchableOpacity>
  );
}

const NEXT_THUMBNAIL_WIDTH = 120;
const NEXT_THUMBNAIL_HEIGHT = 68;

function NextLessonThumbnail({
  thumbnailUrl,
  theme,
  isLoading,
}: {
  thumbnailUrl?: string;
  theme: ReturnType<typeof useTheme>;
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

type LessonLike = {
  id: string;
  order: number;
  title?: string;
  titleKey?: string;
  thumbnailUrl?: string;
  videoId?: string;
};

function NextLessonCard({
  nextLesson,
  moduleId,
  theme,
  t,
  isLocked,
  onPress,
  onLockedPress,
}: {
  nextLesson: LessonLike;
  moduleId: string;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLocked: boolean;
  onPress: () => void;
  onLockedPress?: () => void;
}) {
  const videoIdForThumb = !nextLesson.thumbnailUrl && nextLesson.videoId ? nextLesson.videoId : undefined;
  const { data: vimeoThumbnail, isLoading } = useVimeoThumbnail(videoIdForThumb);
  const thumbnailUrl = nextLesson.thumbnailUrl ?? vimeoThumbnail ?? undefined;
  const thumbnailLoading = !!videoIdForThumb && isLoading && !thumbnailUrl;

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
  }, [isLocked]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handlePress = () => {
    if (isLocked) {
      onLockedPress?.();
    } else {
      onPress();
    }
  };

  const lessonNumberStr = t('lessons.lessonNumber', { number: nextLesson.order });
  const titleStr = nextLesson.title ?? (nextLesson.titleKey ? t(nextLesson.titleKey as never) : '');
  const showNumberSeparately = !titleStr.trim().toLowerCase().startsWith(lessonNumberStr.trim().toLowerCase());

  return (
    <Animated.View style={cardAnimatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
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
            <Box
              style={{
                width: NEXT_THUMBNAIL_WIDTH,
                height: NEXT_THUMBNAIL_HEIGHT,
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <NextLessonThumbnail
                thumbnailUrl={thumbnailUrl}
                theme={theme}
                isLoading={thumbnailLoading}
              />
              <LockOverlay isLocked={isLocked} variant="thumbnail" />
            </Box>
          </Box>
          <Box className="flex-1 justify-center min-w-0">
            {showNumberSeparately && (
              <Text
                className="text-xs font-medium mb-0.5"
                style={{ color: theme.textSecondary }}
              >
                {t('lessons.nextLesson', { number: nextLesson.order })}
              </Text>
            )}
            <Text
              className="text-base font-medium"
              style={{ color: theme.textPrimary }}
              numberOfLines={2}
            >
              {titleStr}
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
      </Box>
    </TouchableOpacity>
    </Animated.View>
  );
}

function StartExamCard({
  moduleId,
  theme,
  t,
  isLocked,
  onLockedPress,
}: {
  moduleId: string;
  theme: ReturnType<typeof useTheme>;
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

function BackToModuleCard({
  moduleId,
  theme,
  t,
}: {
  moduleId: string;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        bzzt();
        router.replace(routes.bibleschoolModule(moduleId));
      }}
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
          className="rounded-xl p-3"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </Box>
        <Text
          className="text-base font-medium flex-1 ml-4"
          style={{ color: theme.textPrimary }}
        >
          {t('lessons.backToModule')}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
      </Box>
    </TouchableOpacity>
  );
}

interface LessonDetailScreenProps {
  moduleId: string;
  lessonId: string;
}

export function LessonDetailScreen({ moduleId, lessonId }: LessonDetailScreenProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLessonUnlocked, isExamUnlocked, nextUnlockedTarget } = useLessonUnlocks();
  const networkQuality = useNetworkQuality();

  const { data: moduleData } = useModule(moduleId, locale);
  const { data: modules } = useModules(locale);
  const lessons = moduleData?.lessons ?? [];
  const lesson = lessons.find((l) => l.id === lessonId);
  const nextLesson = lesson
    ? lessons.find((l) => l.order === lesson.order + 1)
    : undefined;

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: queryKeys.progress.lessonProgress.byUserLesson(user?.id ?? '', lessonId),
    queryFn: () => lessonProgressService.getByUserAndLesson(user!.id, lessonId),
    enabled: !!user?.id && !!lessonId,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const {
    data: vimeoUrl,
    isLoading: vimeoLoading,
    isError: vimeoError,
    refetch: refetchVimeo,
  } = useVimeoPlaybackUrl(
    lesson?.videoId && !lesson.videoUrl ? lesson.videoId : undefined,
    networkQuality,
  );

  const { data: nextVimeoUrl } = useVimeoPlaybackUrl(
    nextLesson?.videoId && !nextLesson?.videoUrl ? nextLesson.videoId : undefined,
    networkQuality,
  );

  const savePositionMutation = useMutation({
    mutationFn: async (videoPositionSeconds: number) => {
      const result = await lessonProgressService.upsertByUserAndLesson(user!.id, lessonId, {
        module_id: moduleId,
        video_position_seconds: videoPositionSeconds,
      });
      const existing = await moduleProgressService.getByUserAndModule(user!.id, moduleId);
      if (!existing || existing.status !== 'completed') {
        const list = await lessonProgressService.listByUserAndModule(user!.id, moduleId);
        const completedCount = list.filter((p) => p.completed).length;
        const progressPercentage =
          lessons.length > 0 && completedCount > 0
            ? Math.round((completedCount / lessons.length) * 100)
            : 0;
        await moduleProgressService.upsertByUserAndModule(user!.id, moduleId, {
          status: 'in_progress',
          progress_percentage: progressPercentage,
        });
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.lessonProgress.lastWatchedByUser(user?.id ?? ''),
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'progress',
      });
    },
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      await lessonProgressService.upsertByUserAndLesson(user!.id, lessonId, {
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      const list = await lessonProgressService.listByUserAndModule(user!.id, moduleId);
      const completedCount = list.filter((p) => p.completed).length;
      const progressPercentage = Math.round((completedCount / lessons.length) * 100);
      await moduleProgressService.upsertByUserAndModule(user!.id, moduleId, {
        status: 'in_progress',
        progress_percentage: progressPercentage,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'progress',
      });
      if (user?.id) {
        await checkAndAwardBadges(user.id).catch(() => []);
        queryClient.invalidateQueries({ queryKey: queryKeys.badges.userBadges(user.id) });
      }
    },
  });

  const lastSaveTimeRef = useRef(0);
  const lastSavePositionRef = useRef<number | null>(null);
  const [lockedModal, setLockedModal] = useState<{
    message: string;
    prerequisiteLessonNumber: number;
    targetModuleNumber: number;
    targetModuleId: string;
    targetModuleTitle: string;
    targetLessonId: string | null;
    isExam: boolean;
  } | null>(null);
  const pipRef = useRef<{
    start: () => void;
    stop: () => void;
    onPiPStop: (() => void) | null;
  } | null>(null);

  const handleSavePosition = useCallback(
    (seconds: number, immediate = false) => {
      if (!user?.id) return;
      const position = Math.floor(seconds);
      const now = Date.now();
      if (immediate) {
        savePositionMutation.mutate(position);
        lastSaveTimeRef.current = now;
        lastSavePositionRef.current = position;
        return;
      }
      const elapsed = now - lastSaveTimeRef.current;
      const positionDelta =
        lastSavePositionRef.current !== null
          ? Math.abs(position - lastSavePositionRef.current)
          : 999;
      if (elapsed >= 5000 || positionDelta >= 10) {
        savePositionMutation.mutate(position);
        lastSaveTimeRef.current = now;
        lastSavePositionRef.current = position;
      }
    },
    [user?.id, savePositionMutation],
  );

  const handleMarkComplete = useCallback(() => {
    if (!user?.id || progress?.completed) return;
    markCompleteMutation.mutate();
  }, [user?.id, progress?.completed, markCompleteMutation]);

  const module = moduleData;
  if (!module || !lesson) {
    return null;
  }

  const handleLessonHandout = () => {
    bzzt();
    if (lesson.lessonHandoutUrl) {
      pipRef.current?.start();
      if (pipRef.current) {
        pipRef.current.onPiPStop = () => {
          WebBrowser.dismissBrowser().catch(() => {});
        };
      }
      requestAnimationFrame(() => {
        WebBrowser.openBrowserAsync(lesson.lessonHandoutUrl!).finally(() => {
          if (pipRef.current) pipRef.current.onPiPStop = null;
          setTimeout(() => pipRef.current?.stop(), 300);
        });
      });
    }
  };

  const handleModuleHandout = () => {
    bzzt();
    const moduleHandoutUrl = module.moduleHandoutUrl ?? lesson.moduleHandoutUrl;
    if (moduleHandoutUrl) {
      pipRef.current?.start();
      if (pipRef.current) {
        pipRef.current.onPiPStop = () => {
          WebBrowser.dismissBrowser().catch(() => {});
        };
      }
      requestAnimationFrame(() => {
        WebBrowser.openBrowserAsync(moduleHandoutUrl).finally(() => {
          if (pipRef.current) pipRef.current.onPiPStop = null;
          setTimeout(() => pipRef.current?.stop(), 300);
        });
      });
    }
  };

  const handleLockedPress = () => {
    bzztWarning();
    const target = nextUnlockedTarget;
    if (!target) return;
    const mod = modules?.find((m) => m.id === target.module.id);
    const targetModuleTitle = mod?.title ?? t(target.module.titleKey as never);
    if (target.type === 'lesson') {
      setLockedModal({
        message: t('lessons.lockedModalMessageModuleLesson', {
          moduleNumber: target.module.order,
          number: target.lesson.order,
        }),
        prerequisiteLessonNumber: target.lesson.order,
        targetModuleNumber: target.module.order,
        targetModuleId: target.module.id,
        targetModuleTitle,
        targetLessonId: target.lesson.id,
        isExam: false,
      });
    } else {
      setLockedModal({
        message: t('lessons.lockedModalMessageExamModule', {
          moduleNumber: target.module.order,
        }),
        prerequisiteLessonNumber: 0,
        targetModuleNumber: target.module.order,
        targetModuleId: target.module.id,
        targetModuleTitle,
        targetLessonId: null,
        isExam: true,
      });
    }
  };

  const videoUrl = lesson.videoUrl ?? vimeoUrl ?? undefined;
  const videoLoading = !lesson.videoUrl && !!lesson.videoId && vimeoLoading;
  const showVimeoRetry =
    !lesson.videoUrl && !!lesson.videoId && vimeoError && !videoUrl;
  const nextVideoUrl = nextVimeoUrl ?? nextLesson?.videoUrl;

  return (
    <Box
      className="flex-1"
      style={{ backgroundColor: theme.pageBg }}
    >
      {nextVideoUrl ? <NextLessonPreloader videoUrl={nextVideoUrl} /> : null}
      <Box
        className="px-6"
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: 0,
        }}
      >
        <MainTopBar
          title={lesson.title ?? ''}
          currentSection="bibleschool"
          showBackButton
          onBack={() => navigation.goBack()}
        />
      </Box>
      <Box className="px-6 rounded-2xl overflow-hidden">
        {videoUrl ? (
          (progressLoading && user) || videoLoading ? (
            <LessonVideoPlaceholder theme={theme} />
          ) : (
            <LessonVideoPlayer
              videoUrl={videoUrl}
              initialPositionSeconds={progress?.video_position_seconds ?? 0}
              onSavePosition={handleSavePosition}
              onMarkComplete={handleMarkComplete}
              pipRef={pipRef}
            />
          )
        ) : showVimeoRetry ? (
          <TouchableOpacity
            onPress={() => {
              bzzt();
              refetchVimeo();
            }}
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
              {t('lessons.videoLoadError', 'Video could not load. Tap to retry.')}
            </Text>
          </TouchableOpacity>
        ) : (
          <LessonVideoPlaceholder theme={theme} />
        )}
      </Box>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <Box
          className="rounded-2xl overflow-hidden p-5 mb-6"
          style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            className="text-sm font-medium uppercase tracking-wider mb-1"
            style={{ color: theme.textSecondary }}
          >
            {t('lessons.lessonNumber', { number: lesson.order })}
          </Text>
          <Text
            className="text-lg font-bold mb-4"
            style={{ color: theme.textPrimary }}
          >
            {lesson.title ?? ''}
          </Text>
          <VStack className="gap-4">
            <Box>
              <Text
                className="text-sm font-semibold uppercase tracking-wider mb-2"
                style={{ color: theme.textSecondary }}
              >
                {t('lessons.content')}
              </Text>
              <Text
                className="text-base"
                style={{ color: theme.textPrimary }}
              >
                {lesson.content || t('lessonsPage.empty')}
              </Text>
            </Box>
            {lesson.goal &&
              !lesson.content?.trim().toLowerCase().includes(lesson.goal.trim().toLowerCase()) && (
              <Box>
                <Text
                  className="text-sm font-semibold uppercase tracking-wider mb-2"
                  style={{ color: theme.textSecondary }}
                >
                  {t('lessons.goal')}
                </Text>
                <Text
                  className="text-base"
                  style={{ color: theme.textPrimary }}
                >
                  {lesson.goal}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>

        <Text
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: theme.textSecondary }}
        >
          {t('handouts.title')}
        </Text>
        <VStack className="gap-3 mb-8">
          <HandoutButton
            label={t('handouts.lesson')}
            theme={theme}
            onPress={handleLessonHandout}
            disabled={!lesson.lessonHandoutUrl}
          />
          <HandoutButton
            label={t('handouts.module')}
            theme={theme}
            onPress={handleModuleHandout}
            disabled={!(module.moduleHandoutUrl ?? lesson.moduleHandoutUrl)}
          />
        </VStack>

        <Text
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: theme.textSecondary }}
        >
          {nextLesson
            ? t('lessons.nextLesson', { number: nextLesson.order })
            : t('exam.takeExam')}
        </Text>
        {nextLesson ? (
          <NextLessonCard
            nextLesson={nextLesson}
            moduleId={moduleId}
            theme={theme}
            t={t}
            isLocked={!isLessonUnlocked(moduleId, nextLesson)}
            onPress={() => {
              bzzt();
              router.replace(routes.bibleschoolModuleLesson(moduleId, nextLesson.id));
            }}
            onLockedPress={handleLockedPress}
          />
        ) : (
          <StartExamCard
            moduleId={moduleId}
            theme={theme}
            t={t}
            isLocked={!isExamUnlocked(moduleId)}
            onLockedPress={handleLockedPress}
          />
        )}
      </ScrollView>
      <LockedLessonModal
        visible={lockedModal !== null}
        message={lockedModal?.message ?? ''}
        prerequisiteLessonNumber={lockedModal?.prerequisiteLessonNumber ?? 0}
        isExam={lockedModal?.isExam ?? false}
        targetModuleNumber={lockedModal?.targetModuleNumber ?? 0}
        targetModuleId={lockedModal?.targetModuleId ?? ''}
        targetModuleTitle={lockedModal?.targetModuleTitle ?? ''}
        targetLessonId={lockedModal?.targetLessonId ?? null}
        onClose={() => setLockedModal(null)}
        onGoToPrerequisite={() => {
          if (!lockedModal) return;
          bzzt();
          setLockedModal(null);
          if (lockedModal.isExam) {
            router.push(routes.bibleschoolModuleExam(lockedModal.targetModuleId));
          } else if (lockedModal.targetLessonId) {
            router.push(
              routes.bibleschoolModuleLesson(
                lockedModal.targetModuleId,
                lockedModal.targetLessonId,
              ),
            );
          }
        }}
      />
    </Box>
  );
}
