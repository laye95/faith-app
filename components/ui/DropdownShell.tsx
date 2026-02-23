import { useTheme } from '@/hooks/useTheme';
import { Modal, Pressable, View } from 'react-native';

interface DropdownShellPosition {
  left: number;
  top: number;
  width: number;
  maxHeight?: number;
}

interface DropdownShellProps {
  visible: boolean;
  onClose: () => void;
  position: DropdownShellPosition | null;
  children: React.ReactNode;
}

export function DropdownShell({
  visible,
  onClose,
  position,
  children,
}: DropdownShellProps) {
  const theme = useTheme();
  const isDark = theme.isDark;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1" onPress={onClose}>
        <View className="flex-1">
          {position && (
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                width: position.width,
                maxHeight: position.maxHeight,
              }}
            >
              <View
                className="rounded-2xl border overflow-hidden"
                style={{
                  width: position.width,
                  maxHeight: position.maxHeight,
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {children}
              </View>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}
