import { DropdownShell } from '@/components/ui/DropdownShell';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';

const DROPDOWN_WIDTH = 300;
const DROPDOWN_MAX_HEIGHT = 320;
const DROPDOWN_GAP = 8;
const RIGHT_PADDING = 16;

export function NotificationDropdown() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const buttonRef = useRef<View>(null);
  const notifications: unknown[] = [];

  const open = () => {
    bzzt();
    buttonRef.current?.measureInWindow((_x, y, _width, height) => {
      const { width: screenWidth } = Dimensions.get('window');
      setPosition({
        left: screenWidth - DROPDOWN_WIDTH - RIGHT_PADDING,
        top: y + (height ?? 0) + DROPDOWN_GAP,
        width: DROPDOWN_WIDTH,
        maxHeight: DROPDOWN_MAX_HEIGHT,
      });
      setVisible(true);
    });
  };

  const close = () => {
    setVisible(false);
    setPosition(null);
  };

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          onPress={open}
          activeOpacity={0.7}
          className="cursor-pointer items-center justify-center"
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.isDark ? 0.2 : 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <DropdownShell visible={visible} onClose={close} position={position}>
        <ScrollView
          style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
          showsVerticalScrollIndicator={true}
        >
          {notifications.length === 0 ? (
            <View className="py-10 px-6 items-center">
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color={theme.textTertiary}
              />
              <Text
                className="text-base mt-3"
                style={{ color: theme.textSecondary }}
              >
                {t('notifications.empty')}
              </Text>
            </View>
          ) : (
            notifications.map((_, i) => (
              <View
                key={i}
                className="py-3 px-4 border-b"
                style={{
                  borderBottomColor: theme.cardBorder,
                }}
              />
            ))
          )}
        </ScrollView>
      </DropdownShell>
    </>
  );
}
