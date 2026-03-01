import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useButtonShadow } from '@/hooks/useShadows';
import { bzzt } from '@/utils/haptics';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';

interface StepManagerProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabelKey?: string;
  completeLabelKey?: string;
  isLastStep?: boolean;
  showStepIndicator?: boolean;
  stepIndicatorVariant?: 'dots' | 'text';
  showBackButton?: boolean;
  isNextLoading?: boolean;
  isNextDisabled?: boolean;
  children: ReactNode;
}

export function StepManager({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  nextLabelKey = 'auth.next',
  completeLabelKey = 'auth.createAccount',
  isLastStep = false,
  showStepIndicator = true,
  stepIndicatorVariant = 'text',
  showBackButton = true,
  isNextLoading = false,
  isNextDisabled = false,
  children,
}: StepManagerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const buttonShadow = useButtonShadow();

  const nextLabel = isLastStep ? t(completeLabelKey) : t(nextLabelKey);

  return (
    <VStack className="gap-5">
      {showStepIndicator && totalSteps > 1 && (
        <HStack className="items-center justify-center gap-2">
          {stepIndicatorVariant === 'dots' ? (
            <HStack className="items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <Box
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === currentStep ? 10 : 8,
                    height: 8,
                    backgroundColor:
                      i === currentStep ? theme.buttonPrimary : theme.cardBorder,
                  }}
                />
              ))}
            </HStack>
          ) : (
            <Text
              className="text-sm font-medium"
              style={{ color: theme.textSecondary }}
            >
              {t('auth.stepOf', { current: currentStep + 1, total: totalSteps })}
            </Text>
          )}
        </HStack>
      )}

      {children}

      <VStack className="gap-3 mt-2">
        {showBackButton && currentStep > 0 && onPrevious && (
          <TouchableOpacity
            onPress={() => {
              bzzt();
              onPrevious();
            }}
            activeOpacity={0.7}
            className="flex-row items-center justify-center gap-2 py-3 cursor-pointer"
          >
            <Ionicons name="chevron-back" size={20} color={theme.buttonPrimary} />
            <Text
              className="text-base font-medium"
              style={{ color: theme.buttonPrimary }}
            >
              {t('common.back')}
            </Text>
          </TouchableOpacity>
        )}

        {onNext && (
          <Button
            onPress={() => {
              bzzt();
              onNext();
            }}
            action="primary"
            variant="solid"
            size="lg"
            className="h-14 cursor-pointer rounded-full"
            isDisabled={isNextDisabled || isNextLoading}
            style={{
              backgroundColor: theme.buttonPrimary,
              ...buttonShadow,
              shadowColor: theme.buttonPrimary,
            }}
          >
            {isNextLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText
              className="text-base font-semibold"
              style={{ color: theme.buttonPrimaryContrast }}
            >
              {isNextLoading ? t('auth.creating') : nextLabel}
            </ButtonText>
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
