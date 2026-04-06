import { useVideoPlayer } from 'expo-video';

export function NextLessonPreloader({ videoUrl }: { videoUrl: string }) {
  const source = { uri: videoUrl, useCaching: true };
  useVideoPlayer(source, (p) => {
    p.pause();
  });
  return null;
}

const __expoRouterPrivateRoute_NextLessonPreloader = () => null;

export default __expoRouterPrivateRoute_NextLessonPreloader;
