import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { TouchableOpacity } from 'react-native';

interface SectionCardProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
}

export function SectionCard({
  icon,
  title,
  subtitle,
  onPress,
  badge,
}: SectionCardProps) {
  const theme = useTheme();
  const isDark = theme.isDark;

  return (
    <TouchableOpacity
      onPress={() => {
        bzzt();
        onPress();
      }}
      activeOpacity={0.7}
      className="cursor-pointer"
    >
      <Box
        className="rounded-2xl p-5"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 16,
          elevation: 3,
        }}
      >
        <HStack className="items-center gap-4">
          <Box
            className="rounded-xl p-3"
            style={{ backgroundColor: theme.avatarPrimary }}
          >
            <Ionicons name={icon} size={28} color={theme.textPrimary} />
          </Box>
          <VStack className="flex-1">
            <Text
              className="text-lg font-bold"
              style={{ color: theme.textPrimary }}
            >
              {title}
            </Text>
            <Text
              className="text-sm"
              style={{ color: theme.textSecondary, marginTop: 2 }}
            >
              {subtitle}
            </Text>
          </VStack>
          {badge && (
            <Box
              className="rounded-lg px-3 py-1"
              style={{ backgroundColor: theme.avatarPrimary }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: theme.textSecondary }}
              >
                {badge}
              </Text>
            </Box>
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textTertiary}
          />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
