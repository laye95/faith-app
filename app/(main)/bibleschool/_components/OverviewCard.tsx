import { Box } from '@/components/ui/box';
import { useCardShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';

interface OverviewCardProps {
  children: React.ReactNode;
  className?: string;
}

export function OverviewCard({ children, className }: OverviewCardProps) {
  const theme = useTheme();
  const cardShadow = useCardShadow();

  return (
    <Box
      className={`rounded-2xl overflow-hidden ${className ?? ''}`}
      style={{
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        ...cardShadow,
      }}
    >
      {children}
    </Box>
  );
}
