import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { ThemeColors } from '@/hooks/useTheme';
import type { BibleschoolLesson } from '@/types/bibleschool';

export function LessonLessonBodyCard({
  lesson,
  theme,
  t,
}: {
  lesson: BibleschoolLesson;
  theme: ThemeColors;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
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
  );
}
