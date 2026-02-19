import { Box } from '@/components/ui/box';
import { MainTopBar } from '../_components/MainTopBar';
import { ComingSoonSection } from '../_components/ComingSoonSection';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PodcastsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="flex-1 px-6 pt-6"
      style={{
        paddingTop: insets.top + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('hub.podcasts')}
        currentSection="podcasts"
        showBackButton
      />

      <ComingSoonSection
        icon="mic"
        titleKey="hub.podcasts"
        subtitleKey="hub.podcastsSubtitle"
        descriptionKey="comingSoon.podcastsDescription"
      />
    </Box>
  );
}
