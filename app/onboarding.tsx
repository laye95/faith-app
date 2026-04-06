import { ONBOARDING_SECTIONS } from '@/constants/onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingSection } from '@/hooks/useOnboardingSection';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';

export default function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const { section: sectionParam } = useLocalSearchParams<{ section?: string }>();

  const section = sectionParam && sectionParam in ONBOARDING_SECTIONS
    ? sectionParam
    : 'bibleschool';

  const config = ONBOARDING_SECTIONS[section]!;
  const { markCompleted, isLoading } = useOnboardingSection(section);
  const [slideIndex, setSlideIndex] = useState(0);

  const currentSlide = config.slides[slideIndex]!;
  const isLast = slideIndex === config.slides.length - 1;

  const gradientColors = [
    theme.pageBg,
    theme.isDark ? theme.cardBg : theme.emptyBg,
  ] as [string, string];

  const complete = async (navigate: () => void) => {
    if (!user?.id) return;
    try {
      await markCompleted();
      navigate();
    } catch {
      toast.error(t('onboarding.saveFailed'));
    }
  };

  const handleSkip = () => {
    bzzt();
    complete(config.onSkip);
  };

  const handlePrimary = () => {
    bzzt();
    if (!isLast) {
      setSlideIndex((i) => i + 1);
    } else {
      complete(config.onComplete);
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <View />
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text className="text-sm font-medium" style={{ color: theme.textTertiary }}>
              {t('onboarding.skip')}
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          key={`${section}-${slideIndex}`}
          entering={FadeInDown.duration(400)}
          exiting={FadeOutUp.duration(250)}
          style={styles.slideContainer}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.avatarPrimary }]}>
            <Ionicons name={currentSlide.icon} size={52} color={theme.textPrimary} />
          </View>

          <Text
            className="text-2xl font-bold text-center mt-8"
            style={{ color: theme.textPrimary, lineHeight: 32 }}
          >
            {t(currentSlide.titleKey)}
          </Text>

          <Text
            className="text-base text-center mt-4 max-w-xs"
            style={{ color: theme.textSecondary, lineHeight: 24 }}
          >
            {t(currentSlide.subtitleKey)}
          </Text>
        </Animated.View>

        <View style={styles.bottom}>
          <View style={styles.dotsRow}>
            {config.slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === slideIndex ? theme.buttonPrimary : theme.cardBorder,
                    width: i === slideIndex ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handlePrimary}
            disabled={isLoading && isLast}
            activeOpacity={0.8}
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.buttonPrimary,
                opacity: isLoading && isLast ? 0.6 : 1,
              },
            ]}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: theme.buttonPrimaryContrast }}
            >
              {isLast ? t(config.ctaKey) : t('onboarding.next')}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={theme.buttonPrimaryContrast}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
