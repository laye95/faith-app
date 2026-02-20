import { ComingSoonOrAdminScreen } from '../_components/ComingSoonOrAdminScreen';

export default function PodcastsScreen() {
  return (
    <ComingSoonOrAdminScreen
      titleKey="hub.podcasts"
      currentSection="podcasts"
      icon="mic"
      subtitleKey="hub.podcastsSubtitle"
      descriptionKey="comingSoon.podcastsDescription"
    />
  );
}
