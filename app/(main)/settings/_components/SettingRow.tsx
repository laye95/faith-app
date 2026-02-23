import { Row } from '@/components/common/Row';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

interface SettingRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  labelKey: string;
  descriptionKey?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  isLast?: boolean;
  fullWidthChildren?: boolean;
}

export function SettingRow({
  icon,
  iconColor,
  labelKey,
  descriptionKey,
  value,
  children,
  fullWidthChildren,
}: SettingRowProps) {
  return (
    <Row
      variant="setting"
      icon={icon}
      iconColor={iconColor}
      labelKey={labelKey}
      descriptionKey={descriptionKey}
      value={children ? undefined : value}
      fullWidthChildren={fullWidthChildren}
    >
      {children}
    </Row>
  );
}
