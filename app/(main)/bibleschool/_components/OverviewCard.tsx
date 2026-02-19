import { Box } from '@/components/ui/box';
import { useTheme } from '@/hooks/useTheme';

interface OverviewCardProps {
  children: React.ReactNode;
  className?: string;
}

export function OverviewCard({ children, className }: OverviewCardProps) {
  const theme = useTheme();
  const isDark = theme.isDark;

  return (
    <Box
      className={`rounded-2xl overflow-hidden ${className ?? ''}`}
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
      {children}
    </Box>
  );
}
