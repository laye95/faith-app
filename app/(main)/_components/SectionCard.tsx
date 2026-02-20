import { Box } from '@/components/ui/box';
import { NavigationRow } from '@/components/common/NavigationRow';
import { useCardShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

interface SectionCardProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
  disabled?: boolean;
}

export function SectionCard({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  disabled = false,
}: SectionCardProps) {
  const theme = useTheme();
  const cardShadow = useCardShadow();

  return (
    <Box
      className="rounded-2xl p-5"
      style={{
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        ...cardShadow,
      }}
    >
      <NavigationRow
        icon={icon}
        title={title}
        subtitle={subtitle}
        badge={badge}
        disabled={disabled}
        onPress={() => {
          bzzt();
          onPress();
        }}
      />
    </Box>
  );
}
