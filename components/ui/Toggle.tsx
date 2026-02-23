import { useTheme } from '@/hooks/useTheme';
import { Switch, View } from 'react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function Toggle({
  value,
  onValueChange,
  isLoading = false,
}: ToggleProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{ padding: 4 }}>
        <LoadingSpinner size="small" />
      </View>
    );
  }

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: theme.cardBorder,
        true: theme.buttonAccept,
      }}
      thumbColor="#FFFFFF"
    />
  );
}
