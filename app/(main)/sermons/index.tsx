import { ComingSoonOrAdminScreen } from '../_components/ComingSoonOrAdminScreen';

export default function SermonsScreen() {
  return (
    <ComingSoonOrAdminScreen
      titleKey="hub.sermons"
      currentSection="sermons"
      icon="videocam"
      subtitleKey="hub.sermonsSubtitle"
      descriptionKey="comingSoon.sermonsDescription"
    />
  );
}
