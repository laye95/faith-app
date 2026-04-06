import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useBibleschoolTab } from '@/contexts/BibleschoolTabContext';
import { routes } from '@/constants/routes';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useModules } from '@/hooks/useBibleschoolContent';
import { useLessonUnlocks } from '@/hooks/useLessonUnlocks';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { bzzt } from '@/utils/haptics';
import { OverviewCard } from './OverviewCard';

export function ContinueLearningCard() {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const { setActiveTab } = useBibleschoolTab();
  const { data: modules } = useModules(locale);
  const { nextUnlockedTarget, isLoading } = useLessonUnlocks();

  const target = !isLoading ? nextUnlockedTarget : null;

  const { moduleLabel, lessonName } = useMemo(() => {
    const baseModuleLabel = (order: number, title: string) => {
      const redundant = title && new RegExp(`^Module\\s*${order}\\s*$`, 'i').test(title.trim());
      return redundant
        ? t('overview.moduleWithNumber', { number: order })
        : t('overview.moduleWithNumber', { number: order }) + (title ? ` ${title}` : '');
    };
    if (!target || !modules?.length) {
      const modTitle = target ? t(target.module.titleKey as never) : '';
      return {
        moduleLabel: target ? baseModuleLabel(target.module.order, modTitle) : '',
        lessonName: target?.type === 'lesson' ? t(target.lesson.titleKey as never) : '',
      };
    }
    const mod = modules.find((m) => m.id === target.module.id);
    const modTitle = mod?.title ?? t(target.module.titleKey as never);
    const lesTitle =
      target.type === 'lesson'
        ? (mod?.lessons.find((l) => l.id === target.lesson.id)?.title ??
          t(target.lesson.titleKey as never))
        : '';
    return {
      moduleLabel: baseModuleLabel(target.module.order, modTitle),
      lessonName: lesTitle,
    };
  }, [target, modules, t]);

  const subtitle = isLoading
    ? t('overview.continueLearningPlaceholder')
    : target?.type === 'lesson'
      ? t('overview.continueLearningNext', {
          moduleLabel,
          lessonName,
        })
      : target?.type === 'exam'
        ? t('overview.continueLearningExamNext', {
            moduleLabel,
          })
        : t('overview.continueLearningAllDone');

  const handlePress = () => {
    if (isLoading) return;
    bzzt();
    if (target?.type === 'lesson') {
      setActiveTab('modules');
      router.push(
        routes.bibleschoolModuleLesson(target.module.id, target.lesson.id),
      );
    } else if (target?.type === 'exam') {
      setActiveTab('modules');
      router.push(routes.bibleschoolModuleExam(target.module.id));
    } else {
      setActiveTab('modules');
      router.push(routes.bibleschoolModules());
    }
  };

  return (
    <OverviewCard>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className="p-5 cursor-pointer"
        style={{ opacity: isLoading ? 0.6 : 1 }}
      >
        <HStack className="items-center justify-between">
          <HStack className="items-center gap-4 flex-1">
            <Box
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.brandAccentMuted }}
            >
              <Ionicons name="book" size={28} color={theme.brandAccent} />
            </Box>
            <Box className="flex-1">
              <Text
                className="text-lg font-bold"
                style={{ color: theme.textPrimary }}
              >
                {t('overview.continueLearningTitle')}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                {subtitle}
              </Text>
            </Box>
          </HStack>
          <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
        </HStack>
      </TouchableOpacity>
    </OverviewCard>
  );
}

const __expoRouterPrivateRoute_ContinueLearningCard = () => null;

export default __expoRouterPrivateRoute_ContinueLearningCard;
