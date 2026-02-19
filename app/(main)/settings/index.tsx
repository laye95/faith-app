import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { MainTopBar } from '../_components/MainTopBar';
import { SettingRow } from './_components/SettingRow';
import { ThemeSwitcher } from './_components/ThemeSwitcher';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import { LanguageSwitcher } from '../../(auth)/login/_components/LanguageSwitcher';

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="flex-1 px-6"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        backgroundColor: theme.pageBg,
      }}
    >
      <MainTopBar
        title={t('navbar.settings')}
        currentSection="settings"
        showBackButton
        onBack={() => router.replace('/(main)/profile')}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 24 }}
      >
        <Box
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Box className="px-5 pt-4 pb-1">
            <Text
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: theme.textSecondary }}
            >
              {t('settings.preferences')}
            </Text>
          </Box>
          <Box className="px-5 pb-4">
            <SettingRow
              icon="language"
              labelKey="settings.language"
            >
              <LanguageSwitcher />
            </SettingRow>
            <Box className="mt-4">
              <SettingRow
                icon="color-palette"
                labelKey="settings.theme"
                isLast
              >
              <ThemeSwitcher />
            </SettingRow>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
