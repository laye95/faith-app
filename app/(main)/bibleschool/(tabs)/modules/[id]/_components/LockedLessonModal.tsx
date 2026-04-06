import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { BaseModal } from '@/components/ui/BaseModal';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

interface LockedLessonModalProps {
  visible: boolean;
  message: string;
  prerequisiteLessonNumber: number;
  targetModuleNumber: number;
  isExam: boolean;
  isIntroRequired?: boolean;
  isOnIntroPage?: boolean;
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
  isIntroRequired = false,
  isOnIntroPage = false,
  targetModuleId,
  targetModuleTitle,
  targetLessonId,
  onClose,
  onGoToPrerequisite,
}: LockedLessonModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      maxWidth={320}
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
        {t('lessons.lockedModalTitle')}
      </Text>
      <Text
        className="text-base text-center leading-6 mb-6"
        style={{ color: theme.textSecondary }}
      >
        {isOnIntroPage ? t('lessons.introPageLockedMessage') : message}
      </Text>
      <Button
        onPress={isOnIntroPage ? onClose : onGoToPrerequisite}
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
          {isOnIntroPage
            ? t('lessons.lockedModalOk')
            : isIntroRequired
              ? t('lessons.watchIntro')
              : isExam
                ? t('lessons.lockedModalGoToExamModule', {
                    moduleNumber: targetModuleNumber,
                  })
                : t('lessons.lockedModalGoToLessonModule', {
                    moduleNumber: targetModuleNumber,
                    number: prerequisiteLessonNumber,
                  })}
        </ButtonText>
      </Button>
    </BaseModal>
  );
}

const __expoRouterPrivateRoute_LockedLessonModal = () => null;

export default __expoRouterPrivateRoute_LockedLessonModal;
