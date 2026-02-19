import { useLocalSearchParams } from 'expo-router';
import { LessonDetailScreen } from '../../_components/LessonDetailScreen';

export default function LessonDirectRoute() {
  const { moduleId, lessonId } = useLocalSearchParams<{
    moduleId: string;
    lessonId: string;
  }>();
  if (!moduleId || !lessonId) return null;
  return <LessonDetailScreen moduleId={moduleId} lessonId={lessonId} />;
}
