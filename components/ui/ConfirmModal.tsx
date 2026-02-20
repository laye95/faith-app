import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTheme } from "@/hooks/useTheme";
import { bzzt } from "@/utils/haptics";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel: string;
  variant?: "default" | "destructive";
  showCancel?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  variant = "default",
  showCancel = true,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
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

  const confirmBg =
    variant === "destructive" ? theme.buttonDecline : theme.buttonPrimary;
  const confirmColor =
    variant === "destructive"
      ? theme.buttonDeclineContrast
      : theme.buttonPrimaryContrast;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center p-6">
        <Pressable
          className="absolute inset-0"
          onPress={() => {
            bzzt();
            onCancel();
          }}
        >
          <Animated.View
            className="absolute inset-0"
            style={{
              backgroundColor: theme.overlayBg,
              opacity: opacityAnim,
            }}
          />
        </Pressable>
        <View className="w-full max-w-[320px] self-center">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              className="w-full max-w-[320px] rounded-3xl border p-6"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text
                className="text-lg font-semibold mb-2 text-center"
                style={{ color: theme.textPrimary }}
              >
                {title}
              </Text>
              <Text
                className="text-base text-center leading-6 mb-6"
                style={{ color: theme.textSecondary }}
              >
                {message}
              </Text>
              <VStack className="gap-3">
                <Button
                  onPress={() => {
                    bzzt();
                    onConfirm();
                  }}
                  action="primary"
                  variant="solid"
                  size="md"
                  className="w-full h-11 cursor-pointer rounded-xl"
                  style={{ backgroundColor: confirmBg }}
                >
                  <ButtonText
                    className="text-sm font-semibold"
                    style={{ color: confirmColor }}
                  >
                    {confirmLabel}
                  </ButtonText>
                </Button>
                {showCancel && (
                  <Button
                    onPress={() => {
                      bzzt();
                      onCancel();
                    }}
                    variant="outline"
                    size="md"
                    className="w-full h-11 cursor-pointer rounded-xl"
                    style={{
                      borderColor: theme.cardBorder,
                    }}
                  >
                    <ButtonText
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      {cancelLabel}
                    </ButtonText>
                  </Button>
                )}
              </VStack>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
