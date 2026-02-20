import { Box } from '@/components/ui/box';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ScreenContainer({
  children,
  className = '',
  noPadding,
}: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Box
      className={`flex-1 ${noPadding ? '' : 'px-6'} ${className}`}
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom,
        backgroundColor: theme.pageBg,
      }}
    >
      {children}
    </Box>
  );
}
