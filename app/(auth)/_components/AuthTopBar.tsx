import { View } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeToggleIcon } from '../login/_components/ThemeToggleIcon';

interface AuthTopBarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function AuthTopBar({ showBackButton, onBack }: AuthTopBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      className="w-full px-6 py-4"
      style={{
        backgroundColor: theme.pageBg,
      }}
    >
      <HStack className="items-center justify-between">
        {showBackButton && onBack ? (
          <TouchableOpacity
            onPress={() => {
              bzzt();
              onBack();
            }}
            activeOpacity={0.7}
            className="cursor-pointer"
          >
            <HStack className="items-center gap-2">
              <Ionicons name="arrow-back" size={22} color={theme.buttonPrimary} />
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.buttonPrimary }}
              >
                {t('auth.back')}
              </Text>
            </HStack>
          </TouchableOpacity>
        ) : (
          <Box />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <ThemeToggleIcon />
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: theme.cardBorder,
            }}
          />
          <LanguageSwitcher variant="inline" />
        </View>
      </HStack>
    </Box>
  );
}
