import { useTheme } from '@/hooks/useTheme';
import { ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export function LoadingSpinner({ size = 'small' }: LoadingSpinnerProps) {
  const theme = useTheme();
  return (
    <ActivityIndicator size={size} color={theme.brandAccent} />
  );
}
