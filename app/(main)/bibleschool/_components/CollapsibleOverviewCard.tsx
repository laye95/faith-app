import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { OverviewCard } from './OverviewCard';
import { Ionicons } from '@expo/vector-icons';
import { bzzt } from '@/utils/haptics';
import { TouchableOpacity } from 'react-native';

interface CollapsibleOverviewCardProps {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
  onCollapseToggle: () => void;
  graphId?: string;
}

export function CollapsibleOverviewCard({
  title,
  children,
  collapsed,
  onCollapseToggle,
}: CollapsibleOverviewCardProps) {
  const theme = useTheme();

  return (
    <OverviewCard>
      <TouchableOpacity
        onPress={() => {
          bzzt();
          onCollapseToggle();
        }}
        activeOpacity={0.7}
        className="cursor-pointer flex-row items-center justify-between p-5"
        style={{
          borderBottomWidth: collapsed ? 0 : 1,
          borderBottomColor: theme.cardBorder,
        }}
      >
        <Text
          className="text-sm font-semibold uppercase tracking-wider flex-1"
          style={{ color: theme.textSecondary }}
        >
          {title}
        </Text>
        <Ionicons
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={theme.textSecondary}
        />
      </TouchableOpacity>
      {!collapsed && <Box className="px-5 pb-5 pt-4">{children}</Box>}
    </OverviewCard>
  );
}

const __expoRouterPrivateRoute_CollapsibleOverviewCard = () => null;

export default __expoRouterPrivateRoute_CollapsibleOverviewCard;
