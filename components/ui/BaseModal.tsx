import { useTheme } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';

interface BaseModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  closeOnOverlayPress?: boolean;
}

export function BaseModal({
  visible,
  onRequestClose,
  children,
  maxWidth = 320,
  closeOnOverlayPress = true,
}: BaseModalProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  const handleOverlayPress = () => {
    if (closeOnOverlayPress) {
      bzzt();
      onRequestClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 justify-center items-center p-6">
        <Pressable className="absolute inset-0" onPress={handleOverlayPress}>
          <Animated.View
            className="absolute inset-0"
            style={{
              backgroundColor: theme.overlayBg,
              opacity: opacityAnim,
            }}
          />
        </Pressable>
        <View style={{ width: '100%', maxWidth }} className="self-center">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              className="rounded-3xl border p-6"
              style={{
                width: '100%',
                maxWidth,
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                transform: [{ scale: scaleAnim }],
              }}
            >
              {children}
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
