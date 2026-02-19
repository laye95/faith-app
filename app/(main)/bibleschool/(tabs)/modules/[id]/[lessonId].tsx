import { useLocalSearchParams } from 'expo-router';
import { LessonDetailScreen } from '../../../_components/LessonDetailScreen';

export default function LessonDetailRoute() {
  const { id, lessonId } = useLocalSearchParams<{ id: string; lessonId: string }>();
  if (!id || !lessonId) return null;
  return <LessonDetailScreen moduleId={id} lessonId={lessonId} />;
}
