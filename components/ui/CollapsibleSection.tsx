import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface CollapsibleSectionProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  headerBg?: string;
}

export function CollapsibleSection({
  title,
  collapsed,
  onToggle,
  children,
  headerBg,
}: CollapsibleSectionProps) {
  const theme = useTheme();
  const bg = headerBg ?? theme.cardBg;

  return (
    <Box
      style={{
        backgroundColor: theme.cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={() => {
          bzzt();
          onToggle();
        }}
        activeOpacity={0.5}
        className="flex-row items-center justify-between px-4 py-3.5"
        style={{
          backgroundColor: bg,
          borderBottomWidth: collapsed ? 0 : 1,
          borderBottomColor: theme.cardBorder,
        }}
      >
        <Text
          className="text-xs font-semibold uppercase tracking-wider"
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
      {!collapsed && (
        <VStack className="gap-4 px-3 pb-3 pt-4">
          {children}
        </VStack>
      )}
    </Box>
  );
}
