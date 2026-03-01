import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { View } from 'react-native';

interface BadgePillProps {
  label: string;
  variant?: 'info' | 'success';
}

export function BadgePill({ label, variant = 'info' }: BadgePillProps) {
  const theme = useTheme();
  const backgroundColor = variant === 'success' ? theme.badgeSuccess : theme.badgeInfo;

  return (
    <View
      className="rounded-full min-w-[24px] h-6 px-2 items-center justify-center"
      style={{ backgroundColor }}
    >
      <Text
        className="text-xs font-semibold"
        style={{ color: theme.textPrimary }}
      >
        {label}
      </Text>
    </View>
  );
}
