import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ComingSoonSectionProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
}

export function ComingSoonSection({
  icon,
  titleKey,
  subtitleKey,
  descriptionKey,
}: ComingSoonSectionProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 4,
        justifyContent: 'center',
      }}
      showsVerticalScrollIndicator={false}
    >
      <Box
        className="rounded-3xl p-8 items-center mx-1"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        }}
      >
        <VStack className="items-center gap-5 max-w-sm">
        <Box
          className="rounded-2xl p-6"
          style={{
            backgroundColor: theme.avatarPrimary,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Ionicons
            name={icon}
            size={56}
            color={theme.textSecondary}
          />
        </Box>
        <VStack className="items-center gap-2">
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: theme.textPrimary }}
          >
            {t(titleKey)}
          </Text>
          <Text
            className="text-base text-center"
            style={{ color: theme.textSecondary }}
          >
            {t(subtitleKey)}
          </Text>
        </VStack>
        <Box
          className="rounded-2xl px-5 py-4 w-full"
          style={{
            backgroundColor: theme.pageBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            className="text-sm text-center leading-6"
            style={{ color: theme.textTertiary }}
          >
            {t(descriptionKey)}
          </Text>
        </Box>
        <Box
          className="rounded-full px-6 py-2.5"
          style={{
            backgroundColor: theme.avatarPrimary,
            borderWidth: 1,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: theme.textSecondary }}
          >
            {t('comingSoon.badge')}
          </Text>
        </Box>
      </VStack>
    </Box>
    </ScrollView>
  );
}
