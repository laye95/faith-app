import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface ModulesSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function ModulesSearchBar({ value, onChangeText }: ModulesSearchBarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="mb-4 flex-row items-center rounded-xl px-3"
      style={{
        backgroundColor: theme.inputBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        minHeight: 48,
      }}
    >
      <Ionicons name="search" size={20} color={theme.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('modules.searchPlaceholder')}
        placeholderTextColor={theme.textTertiary}
        accessibilityLabel={t('modules.searchPlaceholder')}
        returnKeyType="search"
        style={{
          flex: 1,
          marginLeft: 8,
          color: theme.textPrimary,
          fontSize: 16,
          paddingVertical: 8,
        }}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            bzzt();
            onChangeText('');
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={t('modules.searchClear')}
        >
          <Ionicons name="close-circle" size={22} color={theme.textTertiary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const __expoRouterPrivateRoute_ModulesSearchBar = () => null;

export default __expoRouterPrivateRoute_ModulesSearchBar;
