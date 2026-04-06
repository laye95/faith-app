import { ComingSoonOrAdminScreen } from './_components/ComingSoonOrAdminScreen';
import { routes } from '@/constants/routes';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type TeaserConfig = {
  titleKey: string;
  currentSection: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  subtitleKey: string;
  descriptionKey: string;
};

const TEASER_MAP: Record<string, TeaserConfig> = {
  'healing-school': {
    titleKey: 'hub.healingSchool',
    currentSection: 'hub-teaser',
    icon: 'heart',
    subtitleKey: 'hub.healingSchoolSubtitle',
    descriptionKey: 'comingSoon.healingSchoolDescription',
  },
  'bible-verses-learn': {
    titleKey: 'hub.bibleVersesLearn',
    currentSection: 'hub-teaser',
    icon: 'book',
    subtitleKey: 'hub.bibleVersesLearnSubtitle',
    descriptionKey: 'comingSoon.bibleVersesLearnDescription',
  },
  audiobooks: {
    titleKey: 'hub.audiobooks',
    currentSection: 'hub-teaser',
    icon: 'headset',
    subtitleKey: 'hub.audiobooksSubtitle',
    descriptionKey: 'comingSoon.audiobooksDescription',
  },
  giving: {
    titleKey: 'hub.giving',
    currentSection: 'hub-teaser',
    icon: 'gift',
    subtitleKey: 'hub.givingSubtitle',
    descriptionKey: 'comingSoon.givingDescription',
  },
  miracles: {
    titleKey: 'hub.miracles',
    currentSection: 'hub-teaser',
    icon: 'sparkles',
    subtitleKey: 'hub.miraclesSubtitle',
    descriptionKey: 'comingSoon.miraclesDescription',
  },
  'bible-reading-schedule': {
    titleKey: 'hub.bibleReadingSchedule',
    currentSection: 'hub-teaser',
    icon: 'calendar',
    subtitleKey: 'hub.bibleReadingScheduleSubtitle',
    descriptionKey: 'comingSoon.bibleReadingScheduleDescription',
  },
};

export default function HubTeaserScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const key = typeof section === 'string' ? section : undefined;
  const config = key ? TEASER_MAP[key] : undefined;

  if (!config) {
    return <Redirect href={routes.main()} />;
  }

  return <ComingSoonOrAdminScreen {...config} />;
}
