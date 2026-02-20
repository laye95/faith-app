import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

const DROPDOWN_WIDTH = 300;
const DROPDOWN_MAX_HEIGHT = 320;
const DROPDOWN_GAP = 8;
const RIGHT_PADDING = 16;

export function NotificationDropdown() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<{
    x: number;
    y: number;
    width: number;
  } | null>(null);
  const buttonRef = useRef<View>(null);
  const notifications: unknown[] = [];

  const open = () => {
    bzzt();
    buttonRef.current?.measureInWindow((_x, y, _width, height) => {
      const { width: screenWidth } = Dimensions.get('window');
      const dropdownX = screenWidth - DROPDOWN_WIDTH - RIGHT_PADDING;
      setDropdownLayout({
        x: dropdownX,
        y: y + height + DROPDOWN_GAP,
        width: DROPDOWN_WIDTH,
      });
      setVisible(true);
    });
  };

  const close = () => {
    setVisible(false);
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
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable className="flex-1" onPress={close}>
          <View className="flex-1">
            {dropdownLayout && (
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  left: dropdownLayout.x,
                  top: dropdownLayout.y,
                  width: dropdownLayout.width,
                }}
              >
                <View
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    width: DROPDOWN_WIDTH,
                    maxHeight: DROPDOWN_MAX_HEIGHT,
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: theme.isDark ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
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
              </View>
            </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
