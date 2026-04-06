import { Card } from '@/components/ui/Card';
import { NavigationRow } from '@/components/common/NavigationRow';
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
  compact?: boolean;
}

export function SectionCard({
  icon,
  title,
  subtitle,
  onPress,
  badge,
  disabled = false,
  compact = false,
}: SectionCardProps) {
  return (
    <Card padding={compact ? 'sm' : 'lg'}>
      <NavigationRow
        icon={icon}
        title={title}
        subtitle={subtitle}
        badge={badge}
        disabled={disabled}
        compact={compact}
        onPress={() => {
          bzzt();
          onPress();
        }}
      />
    </Card>
  );
}

const __expoRouterPrivateRoute_SectionCard = () => null;

export default __expoRouterPrivateRoute_SectionCard;
