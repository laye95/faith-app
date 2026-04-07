import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useButtonShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';
import { VStack } from '@/components/ui/vstack';

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  onPress: () => void;
}

export function AuthSubmitButton({
  label,
  loadingLabel,
  isLoading,
  onPress,
}: AuthSubmitButtonProps) {
  const theme = useTheme();
  const buttonShadow = useButtonShadow();

  return (
    <VStack className="mt-4 gap-4">
      <Button
        onPress={onPress}
        action="primary"
        variant="solid"
        size="lg"
        className="h-14 cursor-pointer rounded-full"
        isDisabled={isLoading}
        accessibilityState={{ busy: isLoading }}
        style={{
          backgroundColor: theme.buttonPrimary,
          ...buttonShadow,
          shadowColor: theme.buttonPrimary,
        }}
      >
        {isLoading && <ButtonSpinner className="mr-2" />}
        <ButtonText
          className="text-base font-semibold"
          style={{ color: theme.buttonPrimaryContrast }}
        >
          {isLoading ? loadingLabel : label}
        </ButtonText>
      </Button>
    </VStack>
  );
}

const __expoRouterPrivateRoute_AuthSubmitButton = () => null;

export default __expoRouterPrivateRoute_AuthSubmitButton;
