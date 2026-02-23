import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Box className="gap-1">
      {label ? (
        <Text
          className="text-sm"
          style={{ color: theme.textSecondary }}
        >
          {label}
        </Text>
      ) : null}
      <Box
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: theme.brandAccentMuted }}
      >
        <Box
          className="h-full rounded-full"
          style={{
            width: `${clamped}%`,
            backgroundColor: theme.brandAccent,
          }}
        />
      </Box>
    </Box>
  );
}
