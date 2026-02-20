import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MainTopBar } from '@/app/(main)/_components/MainTopBar';
import { useModule, useModules } from '@/hooks/useBibleschoolContent';
import { useVimeoThumbnail } from '@/hooks/useVimeoThumbnail';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { routes } from '@/constants/routes';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { bzzt, bzztWarning } from '@/utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLessonUnlocks } from '@/hooks/useLessonUnlocks';
import { LockedLessonModal } from './_components/LockedLessonModal';

const THUMBNAIL_WIDTH = 120;
const THUMBNAIL_HEIGHT = 68;

function LessonThumbnail({
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
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        backgroundColor: theme.avatarPrimary,
      }}
    >
      {thumbnailUrl ? (
        <Image
          key={thumbnailUrl}
          source={{ uri: thumbnailUrl }}
          style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
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

function LessonRow({
  lesson,
  theme,
  t,
  isCompleted,
  isLocked,
  onPress,
  onLockedPress,
}: {
  lesson: LessonLike;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isCompleted: boolean;
  isLocked: boolean;
  onPress: () => void;
  onLockedPress?: () => void;
}) {
  const videoIdForThumb = !lesson.thumbnailUrl && lesson.videoId ? lesson.videoId : undefined;
  const { data: vimeoThumbnail, isLoading } = useVimeoThumbnail(videoIdForThumb);
  const thumbnailUrl = lesson.thumbnailUrl ?? vimeoThumbnail ?? undefined;
  const thumbnailLoading = !!videoIdForThumb && isLoading && !thumbnailUrl;

  const handlePress = () => {
    if (isLocked) {
      onLockedPress?.();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="cursor-pointer"
      style={isLocked ? { opacity: 0.6 } : undefined}
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
                width: THUMBNAIL_WIDTH,
                height: THUMBNAIL_HEIGHT,
                position: 'relative',
              }}
            >
              <LessonThumbnail
                thumbnailUrl={thumbnailUrl}
                theme={theme}
                isLoading={thumbnailLoading}
              />
              {isLocked ? (
                <Box
                  className="absolute inset-0 items-center justify-center rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: theme.overlayBg,
                  }}
                  pointerEvents="none"
                >
                  <Ionicons name="lock-closed" size={24} color="#ffffff" />
                </Box>
              ) : null}
            </Box>
          </Box>
          <Box className="flex-1 justify-center min-w-0">
            {(() => {
              const lessonNumberStr = t('lessons.lessonNumber', { number: lesson.order });
              const titleStr = lesson.title ?? (lesson.titleKey ? t(lesson.titleKey as never) : '');
              const showNumberSeparately = !titleStr.trim().toLowerCase().startsWith(lessonNumberStr.trim().toLowerCase());
              return (
                <>
                  {showNumberSeparately && (
                    <Text
                      className="text-xs font-medium mb-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {lessonNumberStr}
                    </Text>
                  )}
                  <Text
                    className="text-base font-medium"
                    style={{ color: theme.textPrimary }}
                    numberOfLines={2}
                  >
                    {titleStr}
                  </Text>
                </>
              );
            })()}
          </Box>
          {isLocked ? (
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
          ) : isCompleted ? (
            <Box
              className="flex-row items-center gap-1.5 mr-2 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: theme.badgeSuccess }}
            >
              <Ionicons name="checkmark-circle" size={16} color={theme.textPrimary} />
              <Text
                className="text-xs font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {t('lessons.completed')}
              </Text>
            </Box>
          ) : null}
          {!isLocked ? (
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          ) : null}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export default function ModuleLessonsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const insets = useSafeAreaInsets();

  const { data: module } = useModule(id, locale);
  const { data: modules } = useModules(locale);
  const lessons = module?.lessons ?? [];
  const {
    isLessonUnlocked,
    isExamUnlocked,
    getExamStatusForModule,
    completedLessonIds,
    nextUnlockedTarget,
  } = useLessonUnlocks();

  const examStatus = getExamStatusForModule(id!);
  const [lockedModal, setLockedModal] = useState<{
    message: string;
    prerequisiteLessonNumber: number;
    targetModuleNumber: number;
    targetModuleId: string;
    targetModuleTitle: string;
    targetLessonId: string | null;
    isExam: boolean;
  } | null>(null);

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

  if (!module) {
    return null;
  }

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={module.title}
        currentSection="bibleschool"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 24 }}
      >
        <Text
          className="text-sm font-medium uppercase tracking-wider mb-4"
          style={{ color: theme.textSecondary }}
        >
          {t('lessonsPage.title')}
        </Text>
        {lessons.length === 0 ? (
          <Box
            className="rounded-2xl p-8 items-center justify-center"
            style={{
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <Text
              className="text-base text-center"
              style={{ color: theme.textSecondary }}
            >
              {t('lessonsPage.empty')}
            </Text>
          </Box>
        ) : (
          <VStack className="gap-3">
            {lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                theme={theme}
                t={t}
                isCompleted={completedLessonIds.has(lesson.id)}
                isLocked={!isLessonUnlocked(id!, lesson)}
                onPress={() => {
                  bzzt();
                  router.push(routes.bibleschoolModuleLesson(id!, lesson.id));
                }}
                onLockedPress={handleLockedPress}
              />
            ))}
            {isExamUnlocked(id!) ? (
              examStatus.passed ? (
                <Box
                  className="rounded-2xl flex-row items-center py-4 px-4"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderWidth: 1,
                    borderColor: theme.cardBorder,
                    opacity: 0.7,
                  }}
                >
                  <Box
                    className="rounded-full p-2.5 mr-3"
                    style={{ backgroundColor: theme.badgeSuccess }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.textPrimary}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Text
                      className="text-base font-semibold"
                      style={{ color: theme.textPrimary }}
                    >
                      {t('exam.passed')}
                    </Text>
                    <Text
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {t('exam.passedHint')}
                    </Text>
                  </Box>
                  <Ionicons
                    name="lock-closed"
                    size={20}
                    color={theme.textSecondary}
                  />
                </Box>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    bzzt();
                    router.push(routes.bibleschoolModuleExam(id!));
                  }}
                  activeOpacity={0.7}
                  className="cursor-pointer"
                >
                  <Box
                    className="rounded-2xl flex-row items-center py-4 px-4"
                    style={{
                      backgroundColor: theme.cardBg,
                      borderWidth: 1,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    <Box
                      className="rounded-full p-2.5 mr-3"
                      style={{ backgroundColor: theme.avatarPrimary }}
                    >
                      <Ionicons
                        name="document-text"
                        size={24}
                        color={theme.textPrimary}
                      />
                    </Box>
                    <Box className="flex-1">
                      <Text
                        className="text-base font-semibold"
                        style={{ color: theme.textPrimary }}
                      >
                        {examStatus.latestFailedAttempt
                          ? t('exam.failedScore', {
                              score: examStatus.latestFailedAttempt.score,
                              correct: examStatus.latestFailedAttempt.correct,
                              total: examStatus.latestFailedAttempt.total,
                            })
                          : t('exam.takeExam')}
                      </Text>
                      <Text
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        {examStatus.latestFailedAttempt
                          ? t('exam.retryHint')
                          : t('exam.readyHint')}
                      </Text>
                    </Box>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.textTertiary}
                    />
                  </Box>
                </TouchableOpacity>
              )
            ) : null}
          </VStack>
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
