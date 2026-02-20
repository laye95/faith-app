import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useModule } from '@/hooks/useBibleschoolContent';
import { routes } from '@/constants/routes';
import { useLessonUnlocks } from '@/hooks/useLessonUnlocks';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect } from 'react';
import { LessonDetailScreen } from '../../../_components/LessonDetailScreen';

export default function LessonDetailRoute() {
  const { id, lessonId } = useLocalSearchParams<{ id: string; lessonId: string }>();
  const toast = useToast();
  const { t, locale } = useTranslation();
  const { isLessonUnlocked, isLoading } = useLessonUnlocks();
  const { data: moduleData, isLoading: moduleLoading } = useModule(id, locale);

  const lesson =
    id && lessonId && moduleData?.lessons
      ? moduleData.lessons.find((l) => l.id === lessonId)
      : undefined;

  useEffect(() => {
    if (isLoading || moduleLoading || !id || !lessonId || !lesson) return;
    if (!isLessonUnlocked(id, lesson)) {
      toast.error(t('lessons.unlockHint', { number: lesson.order - 1 }));
      router.replace(routes.bibleschoolModule(id));
    }
  }, [id, lessonId, lesson, isLessonUnlocked, isLoading, moduleLoading, toast, t]);

  if (!id || !lessonId) return null;
  if (isLoading || moduleLoading) return <LoadingScreen message={t('lessons.content')} />;
  if (lesson && !isLessonUnlocked(id, lesson)) return null;
  return <LessonDetailScreen moduleId={id} lessonId={lessonId} />;
}
