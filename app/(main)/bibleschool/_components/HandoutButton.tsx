import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export function HandoutButton({
  label,
  theme,
  onPress,
}: {
  label: string;
  theme: ThemeColors;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="cursor-pointer"
    >
      <Box
        className="flex-row items-center gap-3 px-5 py-4 rounded-2xl"
        style={{
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
        }}
      >
        <Box
          className="rounded-xl p-2.5"
          style={{ backgroundColor: theme.avatarPrimary }}
        >
          <Ionicons name="document-text" size={24} color={theme.textPrimary} />
        </Box>
        <Text
          className="text-base font-medium flex-1"
          style={{ color: theme.textPrimary }}
        >
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
      </Box>
    </TouchableOpacity>
  );
}
