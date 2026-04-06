import { routes } from '@/constants/routes';
import { router } from 'expo-router';
import type { Ionicons } from '@expo/vector-icons';

export interface OnboardingSlide {
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  subtitleKey: string;
}

export interface SectionOnboardingConfig {
  /** Slides shown in order. The last slide shows the `ctaKey` button. */
  slides: OnboardingSlide[];
  /** i18n key for the primary button on the last slide. */
  ctaKey: string;
  /**
   * Called after marking the section as completed.
   * Replace the onboarding screen with the correct destination
   * so the back-stack is set up properly.
   */
  onComplete: () => void;
  /**
   * Called when the user taps "Skip".
   * Usually navigates to the section's root without any deeper destination.
   */
  onSkip: () => void;
}

/**
 * Add a new section's onboarding here.
 * You also need to:
 *  1. Add the layout check (useOnboardingSection + <Redirect>) in the section's _layout.tsx
 *  2. Add locale keys (onboarding.* in all 5 locale files)
 * Registration pre-seeding is automatic via REGISTRATION_ONBOARDING_SECTIONS below.
 */
export const ONBOARDING_SECTIONS: Record<string, SectionOnboardingConfig> = {
  home: {
    slides: [
      {
        icon: 'sparkles-outline',
        titleKey: 'onboarding.homeWelcomeTitle',
        subtitleKey: 'onboarding.homeWelcomeSubtitle',
      },
      {
        icon: 'grid-outline',
        titleKey: 'onboarding.homeAppsTitle',
        subtitleKey: 'onboarding.homeAppsSubtitle',
      },
      {
        icon: 'rocket-outline',
        titleKey: 'onboarding.homeBeginTitle',
        subtitleKey: 'onboarding.homeBeginSubtitle',
      },
    ],
    ctaKey: 'onboarding.homeBeginCta',
    onComplete: () => router.replace(routes.main()),
    onSkip: () => router.replace(routes.main()),
  },

  bibleschool: {
    slides: [
      {
        icon: 'school-outline',
        titleKey: 'onboarding.welcomeTitle',
        subtitleKey: 'onboarding.welcomeSubtitle',
      },
      {
        icon: 'layers-outline',
        titleKey: 'onboarding.contentTitle',
        subtitleKey: 'onboarding.contentSubtitle',
      },
      {
        icon: 'play-circle-outline',
        titleKey: 'onboarding.startTitle',
        subtitleKey: 'onboarding.startSubtitle',
      },
    ],
    ctaKey: 'onboarding.startCta',
    onComplete: () => {
      router.replace(routes.bibleschool());
    },
    onSkip: () => router.replace(routes.bibleschool()),
  },
};

/**
 * All section keys listed here will be pre-seeded with `false`
 * in user_settings immediately after registration so that new
 * users see the onboarding when they visit each section for the first time.
 * Existing users (null in DB) are always skipped.
 */
export const REGISTRATION_ONBOARDING_SECTIONS = Object.keys(ONBOARDING_SECTIONS);
