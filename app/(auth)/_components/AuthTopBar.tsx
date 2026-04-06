import { View } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useCompactShadow } from '@/hooks/useShadows';
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
  const containerShadow = useCompactShadow();

  return (
    <Box
      className="w-full px-6 py-4"
      style={{
        backgroundColor: 'transparent',
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
            className="flex-row items-center gap-2 cursor-pointer rounded-full pl-3 pr-4 py-2"
            style={{
              backgroundColor: theme.cardBg,
              borderWidth: 1,
              borderColor: theme.cardBorder,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={theme.buttonPrimary} />
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.buttonPrimary }}
            >
              {t('auth.back')}
            </Text>
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
            ...containerShadow,
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
          <LanguageSwitcher
            variant="inline"
            matchDropdownToTrigger
            showTriggerLabel={false}
          />
        </View>
      </HStack>
    </Box>
  );
}
