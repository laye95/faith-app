import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BaseModal } from '@/components/ui/BaseModal';
import { useTheme } from '@/hooks/useTheme';
import { bzzt } from '@/utils/haptics';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel: string;
  variant?: 'default' | 'destructive';
  showCancel?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  variant = 'default',
  showCancel = true,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const theme = useTheme();

  const confirmBg =
    variant === 'destructive' ? theme.buttonDecline : theme.buttonPrimary;
  const confirmColor =
    variant === 'destructive'
      ? theme.buttonDeclineContrast
      : theme.buttonPrimaryContrast;

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onCancel}
      maxWidth={320}
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
          className="w-full h-11 cursor-pointer rounded-full"
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
            className="w-full h-11 cursor-pointer rounded-full"
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
    </BaseModal>
  );
}
