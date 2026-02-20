import { useRef, useState } from 'react';
import {
  TouchableOpacity,
  Dimensions,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemePreference } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePreference } from '@/contexts/ThemeContext';

interface ThemeSwitcherProps {
  fullWidth?: boolean;
}

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
}> = [
  { value: 'light', icon: 'sunny', labelKey: 'settings.themeLight' },
  { value: 'dark', icon: 'moon', labelKey: 'settings.themeDark' },
  { value: 'system', icon: 'phone-portrait', labelKey: 'settings.themeSystem' },
];

export function ThemeSwitcher({ fullWidth = false }: ThemeSwitcherProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { preference, setPreference } = useThemePreference();
  const [expanded, setExpanded] = useState(false);
  const [layout, setLayout] = useState<{ x: number; y: number; width: number } | null>(null);
  const triggerRef = useRef<View>(null);
  const isDark = theme.isDark;
  const { width: screenWidth } = Dimensions.get('window');
  const switcherWidth = Math.min(screenWidth - 96, 320);
  const containerStyle = fullWidth
    ? { flex: 1, alignSelf: 'stretch' as const }
    : { width: switcherWidth, minWidth: switcherWidth };

  const currentLabel =
    THEME_OPTIONS.find((o) => o.value === preference)?.labelKey ?? 'system';
  const currentIcon =
    THEME_OPTIONS.find((o) => o.value === preference)?.icon ?? 'phone-portrait';

  const handleOpen = () => {
    bzzt();
    triggerRef.current?.measureInWindow((x, y, width) => {
      setLayout({ x, y, width });
      setExpanded(true);
    });
  };

  const handleClose = () => {
    setExpanded(false);
    setLayout(null);
  };

  const handleSelect = async (value: ThemePreference) => {
    bzzt();
    await setPreference(value);
    handleClose();
  };

  return (
    <View ref={triggerRef} style={containerStyle} collapsable={false}>
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.7}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: theme.cardBg,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <HStack className="items-center gap-2">
          <Ionicons
            name={currentIcon as keyof typeof Ionicons.glyphMap}
            size={20}
            color={theme.textPrimary}
          />
          <Text
            className="text-sm font-semibold flex-1"
            style={{ color: theme.textPrimary }}
          >
            {t(currentLabel)}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.textSecondary}
          />
        </HStack>
      </TouchableOpacity>

      <Modal
        visible={expanded}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          {layout && (
            <View
              style={{
                position: 'absolute',
                left: layout.x,
                top: layout.y + 48,
                width: layout.width,
                marginTop: 4,
                zIndex: 9999,
              }}
            >
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: theme.cardBg,
                  borderWidth: 1,
                  borderColor: theme.cardBorder,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.25 : 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {THEME_OPTIONS.map((opt, index) => {
                  const isSelected = preference === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => handleSelect(opt.value)}
                      activeOpacity={0.7}
                      style={{
                        paddingVertical: 18,
                        paddingHorizontal: 20,
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(23, 23, 23, 0.3)'
                            : 'rgba(23, 23, 23, 0.06)'
                          : 'transparent',
                        borderTopWidth: index > 0 ? 1 : 0,
                        borderTopColor: theme.cardBorder,
                      }}
                    >
                      <HStack className="items-center gap-3">
                        <Ionicons
                          name={
                            isSelected
                              ? opt.icon
                              : (`${opt.icon}-outline` as typeof opt.icon)
                          }
                          size={22}
                          color={
                            isSelected
                              ? theme.buttonPrimary
                              : theme.textSecondary
                          }
                        />
                        <Text
                          className="flex-1 text-base font-medium"
                          style={{ color: theme.textPrimary }}
                        >
                          {t(opt.labelKey)}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color={theme.buttonPrimary}
                          />
                        )}
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
