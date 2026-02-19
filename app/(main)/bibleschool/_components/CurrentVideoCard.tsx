import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { bzzt } from '@/utils/haptics';
import { OverviewCard } from './OverviewCard';

export function CurrentVideoCard() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <OverviewCard>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => bzzt()}
        className="cursor-pointer"
      >
        <Box
          className="aspect-video items-center justify-center"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          <Box
            className="rounded-full p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Ionicons name="play" size={40} color="#FFFFFF" />
          </Box>
        </Box>
        <Box className="p-5">
          <Text
            className="text-sm font-semibold uppercase tracking-wider mb-1"
            style={{ color: theme.textSecondary }}
          >
            {t('overview.currentVideoTitle')}
          </Text>
          <Text
            className="text-base"
            style={{ color: theme.textSecondary }}
          >
            {t('overview.currentVideoPlaceholder')}
          </Text>
          <HStack className="items-center gap-2 mt-3">
            <Ionicons name="play-circle" size={18} color={theme.buttonPrimary} />
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.buttonPrimary }}
            >
              {t('overview.continueWatching')}
            </Text>
          </HStack>
        </Box>
      </TouchableOpacity>
    </OverviewCard>
  );
}
