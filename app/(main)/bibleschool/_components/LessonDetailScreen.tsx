import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { MainTopBar } from '../../_components/MainTopBar';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import {
  MODULES,
  getLessonsForModule,
  type Lesson,
} from '@/constants/modules';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation, router } from 'expo-router';
import { bzzt } from '@/utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native';

function LessonVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      style={{ width: '100%', aspectRatio: 16 / 9 }}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

function LessonVideoPlaceholder({ theme }: { theme: ReturnType<typeof useTheme> }) {
  return (
    <Box
      className="w-full items-center justify-center"
      style={{
        aspectRatio: 16 / 9,
        backgroundColor: theme.avatarPrimary,
      }}
    >
      <Box
        className="rounded-full p-4 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <Ionicons name="play" size={48} color="#ffffff" />
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

function NextLessonCard({
  nextLesson,
  moduleId,
  theme,
  t,
}: {
  nextLesson: Lesson;
  moduleId: string;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        bzzt();
        router.replace(`/(main)/bibleschool/modules/${moduleId}/${nextLesson.id}`);
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
          className="rounded-xl overflow-hidden"
          style={{
            width: 96,
            height: 54,
            backgroundColor: theme.avatarPrimary,
          }}
        >
          {nextLesson.thumbnailUrl ? (
            <Image
              source={{ uri: nextLesson.thumbnailUrl }}
              style={{ width: 96, height: 54 }}
              contentFit="cover"
            />
          ) : null}
        </Box>
        <Box className="flex-1 ml-4">
          <Text
            className="text-xs font-medium mb-0.5"
            style={{ color: theme.textSecondary }}
          >
            {t('lessons.nextLesson', { number: nextLesson.order })}
          </Text>
          <Text
            className="text-base font-semibold"
            style={{ color: theme.textPrimary }}
          >
            {t(nextLesson.titleKey as never)}
          </Text>
        </Box>
        <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
      </Box>
    </TouchableOpacity>
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
        router.replace(`/(main)/bibleschool/modules/${moduleId}`);
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const module = MODULES.find((m) => m.id === moduleId);
  const lessons = module ? getLessonsForModule(moduleId) : [];
  const lesson = lessons.find((l) => l.id === lessonId);
  const nextLesson = lesson
    ? lessons.find((l) => l.order === lesson.order + 1)
    : undefined;

  if (!module || !lesson) {
    return null;
  }

  const handleLessonHandout = () => {
    bzzt();
    if (lesson.lessonHandoutUrl) {
      WebBrowser.openBrowserAsync(lesson.lessonHandoutUrl);
    }
  };

  const handleModuleHandout = () => {
    bzzt();
    const moduleHandoutUrl = module.moduleHandoutUrl ?? lesson.moduleHandoutUrl;
    if (moduleHandoutUrl) {
      WebBrowser.openBrowserAsync(moduleHandoutUrl);
    }
  };

  return (
    <Box
      className="flex-1 px-6"
      style={{ backgroundColor: theme.pageBg }}
    >
      <Box
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom,
        }}
      >
        <MainTopBar
          title={t(lesson.titleKey as never)}
          currentSection="bibleschool"
          showBackButton
          onBack={() => navigation.goBack()}
        />
      </Box>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        <Box className="rounded-2xl overflow-hidden" style={{ marginBottom: 24 }}>
          {lesson.videoUrl ? (
            <LessonVideoPlayer videoUrl={lesson.videoUrl} />
          ) : (
            <LessonVideoPlaceholder theme={theme} />
          )}
        </Box>

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
            {t(lesson.titleKey as never)}
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
                {lesson.goal || t('lessonsPage.empty')}
              </Text>
            </Box>
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
          {nextLesson ? t('lessons.nextLesson', { number: nextLesson.order }) : t('lessons.backToModule')}
        </Text>
        {nextLesson ? (
          <NextLessonCard
            nextLesson={nextLesson}
            moduleId={moduleId}
            theme={theme}
            t={t}
          />
        ) : (
          <BackToModuleCard moduleId={moduleId} theme={theme} t={t} />
        )}
      </ScrollView>
    </Box>
  );
}
