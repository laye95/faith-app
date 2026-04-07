import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'InteractionManager has been deprecated',
  '[Reanimated] Property "opacity"',
  'Failed to load available audio tracks for https://player.vimeo.com',
  'Failed to load available subtitle tracks for https://player.vimeo.com',
  'CoreMediaErrorDomain Code=-19583',
]);
