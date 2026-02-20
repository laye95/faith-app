import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, View } from "react-native";

interface LockedLessonModalProps {
  visible: boolean;
  message: string;
  prerequisiteLessonNumber: number;
  targetModuleNumber: number;
  isExam: boolean;
  targetModuleId: string;
  targetModuleTitle: string;
  targetLessonId: string | null;
  onClose: () => void;
  onGoToPrerequisite: () => void;
}

export function LockedLessonModal({
  visible,
  message,
  prerequisiteLessonNumber,
  targetModuleNumber,
  isExam,
  targetModuleId,
  targetModuleTitle,
  targetLessonId,
  onClose,
  onGoToPrerequisite,
}: LockedLessonModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center p-6">
        <Pressable className="absolute inset-0" onPress={onClose}>
          <Animated.View
            className="absolute inset-0"
            style={{
              backgroundColor: theme.overlayBg,
              opacity: opacityAnim,
            }}
          />
        </Pressable>
        <View className="w-full max-w-[320px] self-center">
          <Animated.View
            className="w-full max-w-[320px] rounded-3xl border p-6 relative"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View className="flex-row justify-end -mt-2 mb-2">
              <View className="flex-1" />
              <Pressable
                onPress={onClose}
                className="p-1"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </Pressable>
            </View>
            <Box
              className="rounded-full p-4 mb-4 mt-2 items-center justify-center self-center"
              style={{ backgroundColor: theme.avatarPrimary }}
            >
              <Ionicons
                name="lock-closed"
                size={40}
                color={theme.textSecondary}
              />
            </Box>
            <Text
              className="text-lg font-semibold mb-2 text-center"
              style={{ color: theme.textPrimary }}
            >
              {t("lessons.lockedModalTitle")}
            </Text>
            <Text
              className="text-base text-center leading-6 mb-6"
              style={{ color: theme.textSecondary }}
            >
              {message}
            </Text>
            <Button
              onPress={onGoToPrerequisite}
              action="primary"
              variant="solid"
              size="md"
              className="w-full h-10 cursor-pointer rounded-lg"
              style={{ backgroundColor: theme.buttonPrimary }}
            >
              <ButtonText
                className="text-sm font-semibold"
                style={{ color: theme.buttonPrimaryContrast }}
              >
                {isExam
                  ? t("lessons.lockedModalGoToExamModule", {
                      moduleNumber: targetModuleNumber,
                    })
                  : t("lessons.lockedModalGoToLessonModule", {
                      moduleNumber: targetModuleNumber,
                      number: prerequisiteLessonNumber,
                    })}
              </ButtonText>
            </Button>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
