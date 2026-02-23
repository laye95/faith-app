import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'info';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const theme = useTheme();
  const bg =
    variant === 'success'
      ? theme.badgeSuccessBg
      : variant === 'info'
        ? theme.badgeInfoBg
        : theme.avatarPrimary;
  const textColor =
    variant === 'success' || variant === 'info'
      ? theme.textPrimary
      : theme.textSecondary;

  return (
    <Box
      className="rounded-lg px-3 py-1"
      style={{ backgroundColor: bg }}
    >
      <Text
        className="text-xs font-semibold"
        style={{ color: textColor }}
      >
        {label}
      </Text>
    </Box>
  );
}
