import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

interface SettingRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  labelKey: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  isLast?: boolean;
}

export function SettingRow({
  icon,
  iconColor,
  labelKey,
  value,
  children,
  isLast,
}: SettingRowProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = iconColor ?? theme.textSecondary;

  return (
    <Box>
      <Text
        className="text-sm font-semibold mb-2"
        style={{ color: theme.textPrimary }}
      >
        {t(labelKey)}
      </Text>
      <HStack
        className="items-center justify-between"
        style={{
          paddingBottom: isLast ? 0 : 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.cardBorder,
        }}
      >
        <HStack className="items-center gap-3 flex-1 min-w-0">
          <Ionicons name={icon} size={22} color={color} />
        </HStack>
      {children ? (
        <Box className="ml-3" style={{ flexShrink: 0 }}>{children}</Box>
      ) : (
        value !== undefined && <Box className="ml-3" style={{ flexShrink: 0 }}>{value}</Box>
      )}
      </HStack>
    </Box>
  );
}
