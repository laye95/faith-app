import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MainTopBar } from '../../../../_components/MainTopBar';
import { useAuth } from '@/contexts/AuthContext';
import {
  MODULES,
  getLessonsForModule,
  type Lesson,
} from '@/constants/modules';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { lessonProgressService } from '@/services/api/lessonProgressService';
import { queryKeys } from '@/services/queryKeys';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { bzzt } from '@/utils/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

const THUMBNAIL_WIDTH = 120;
const THUMBNAIL_HEIGHT = 68;

function LessonThumbnail({
  thumbnailUrl,
  theme,
}: {
  thumbnailUrl?: string;
  theme: ReturnType<typeof useTheme>;
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
          source={{ uri: thumbnailUrl }}
          style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
          contentFit="cover"
        />
      ) : null}
      <Box
        className="absolute inset-0 items-center justify-center"
        pointerEvents="none"
      >
        <Box
          className="rounded-full p-2 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Ionicons name="play" size={18} color="#ffffff" />
        </Box>
      </Box>
    </Box>
  );
}

function LessonRow({
  lesson,
  theme,
  t,
  isCompleted,
  onPress,
}: {
  lesson: Lesson;
  theme: ReturnType<typeof useTheme>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isCompleted: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="cursor-pointer">
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
            <LessonThumbnail thumbnailUrl={lesson.thumbnailUrl} theme={theme} />
          </Box>
          <Box className="flex-1 justify-center min-w-0">
            <Text
              className="text-xs font-medium mb-0.5"
              style={{ color: theme.textSecondary }}
            >
              {t('lessons.lessonNumber', { number: lesson.order })}
            </Text>
            <Text
              className="text-base font-medium"
              style={{ color: theme.textPrimary }}
              numberOfLines={2}
            >
              {t(lesson.titleKey as never)}
            </Text>
          </Box>
          {isCompleted ? (
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
          <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export default function ModuleLessonsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const module = MODULES.find((m) => m.id === id);
  const lessons = module ? getLessonsForModule(id) : [];

  const { data: lessonProgressList } = useQuery({
    queryKey: queryKeys.progress.lessonProgress.byUserModule(user?.id ?? '', id ?? ''),
    queryFn: () => lessonProgressService.listByUserAndModule(user!.id, id!),
    enabled: !!user?.id && !!id,
  });

  const completedLessonIds = useMemo(() => {
    if (!lessonProgressList) return new Set<string>();
    return new Set(
      lessonProgressList.filter((p) => p.completed).map((p) => p.lesson_id),
    );
  }, [lessonProgressList]);

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
        title={t(module.titleKey as never)}
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
                onPress={() => {
                  bzzt();
                  router.push(`/(main)/bibleschool/modules/${id}/${lesson.id}`);
                }}
              />
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}
