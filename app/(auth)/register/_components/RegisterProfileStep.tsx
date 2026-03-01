import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { ProfileFieldsForm } from '@/components/common/ProfileFieldsForm';
import { useAuthCardShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';

interface RegisterProfileStepProps {
  phone: string;
  birthdate: string | null;
  country: string;
  city: string;
  onPhoneChange: (value: string) => void;
  onBirthdateChange: (value: string | null) => void;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  phoneError?: string;
  birthdateError?: string;
  isLoading: boolean;
  onSubmit?: () => void;
}

export function RegisterProfileStep({
  phone,
  birthdate,
  country,
  city,
  onPhoneChange,
  onBirthdateChange,
  onCountryChange,
  onCityChange,
  phoneError,
  birthdateError,
  isLoading,
  onSubmit,
}: RegisterProfileStepProps) {
  const theme = useTheme();
  const cardShadow = useAuthCardShadow();

  return (
    <Box
      className="rounded-3xl p-6"
      style={{
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        ...cardShadow,
      }}
    >
      <VStack className="gap-5">
        <ProfileFieldsForm
          phone={phone}
          birthdate={birthdate}
          country={country}
          city={city}
          onPhoneChange={onPhoneChange}
          onBirthdateChange={onBirthdateChange}
          onCountryChange={onCountryChange}
          onCityChange={onCityChange}
          phoneError={phoneError}
          birthdateError={birthdateError}
          editable={!isLoading}
          onLastFieldSubmit={onSubmit}
        />
      </VStack>
    </Box>
  );
}
