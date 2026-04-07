import logoFull from '@/assets/images/logo_full.png';
import { DottedRingSpinner } from '@/components/ui/DottedRingSpinner';
import {
  BRANDED_BOTTOM_SPACER_BELOW_SPINNER,
  BRANDED_LOGO_HEIGHT,
  BRANDED_LOGO_WIDTH,
  BRANDED_SLOGAN_FONT_SIZE,
  BRANDED_SLOGAN_LETTER_SPACING,
  BRANDED_SLOGAN_LINE_HEIGHT,
} from '@/constants/brandedSplashLayout';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/i18n';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BrandedSplashScreenProps {
  useSystemFonts?: boolean;
}

export function BrandedSplashScreen({
  useSystemFonts = false,
}: BrandedSplashScreenProps) {
  const insets = useSafeAreaInsets();
  const textFont = useSystemFonts
    ? { fontWeight: '700' as const }
    : { fontFamily: 'Poppins_700Bold' };

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 20) + 32 }]}>
      <StatusBar style="light" />
      <View style={styles.centerBlock}>
        <Image
          source={logoFull}
          style={styles.logoFull}
          contentFit="contain"
          accessibilityLabel="Faith Generation"
        />
      </View>
      <View style={styles.bottomBlock}>
        <DottedRingSpinner />
        <View style={styles.sloganBlock}>
          <Text style={[styles.sloganLine, textFont]}>
            {i18n.t('splash.sloganLine1')}
          </Text>
          <Text style={[styles.sloganLine, textFont]}>
            {i18n.t('splash.sloganLine2')}
          </Text>
          <Text style={[styles.sloganLine, textFont]}>
            {i18n.t('splash.sloganLine3')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoFull: {
    width: BRANDED_LOGO_WIDTH,
    height: BRANDED_LOGO_HEIGHT,
  },
  bottomBlock: {
    alignItems: 'center',
    gap: BRANDED_BOTTOM_SPACER_BELOW_SPINNER,
    paddingHorizontal: 24,
  },
  sloganBlock: {
    alignItems: 'center',
    gap: 0,
  },
  sloganLine: {
    color: '#FFFFFF',
    fontSize: BRANDED_SLOGAN_FONT_SIZE,
    lineHeight: BRANDED_SLOGAN_LINE_HEIGHT,
    letterSpacing: BRANDED_SLOGAN_LETTER_SPACING,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
