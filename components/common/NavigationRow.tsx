import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';

interface NavigationRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string;
  rightElement?: ReactNode;
  disabled?: boolean;
}

export function NavigationRow({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  rightElement,
  disabled = false,
}: NavigationRowProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.7}
      className="cursor-pointer"
      disabled={disabled}
      style={disabled ? { opacity: 0.5 } : undefined}
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
          {subtitle ? (
            <Text
              className="text-sm"
              style={{ color: theme.textSecondary, marginTop: 2 }}
            >
              {subtitle}
            </Text>
          ) : null}
        </VStack>
        {badge ? (
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
        ) : null}
        {rightElement ??
          (disabled ? null : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          ))}
      </HStack>
    </TouchableOpacity>
  );
}
