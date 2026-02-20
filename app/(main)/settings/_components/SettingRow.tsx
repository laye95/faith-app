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
  fullWidthChildren?: boolean;
}

export function SettingRow({
  icon,
  iconColor,
  labelKey,
  value,
  children,
  isLast,
  fullWidthChildren,
}: SettingRowProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = iconColor ?? theme.textSecondary;

  return (
    <HStack
      className="items-center justify-between px-4 py-3"
      style={{
        minHeight: 48,
      }}
    >
      <HStack className="items-center gap-3 flex-1 min-w-0">
        <Ionicons name={icon} size={20} color={color} />
        <Text
          className="text-base font-medium"
          style={{ color: theme.textPrimary }}
          numberOfLines={1}
        >
          {t(labelKey)}
        </Text>
      </HStack>
      {children ? (
        <Box
          className="ml-3"
          style={fullWidthChildren ? { flex: 1, minWidth: 0 } : { flexShrink: 0 }}
        >
          {children}
        </Box>
      ) : (
        value !== undefined && (
          <Box className="ml-3" style={{ flexShrink: 0 }}>
            {value}
          </Box>
        )
      )}
    </HStack>
  );
}
