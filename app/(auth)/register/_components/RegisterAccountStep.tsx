import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useAuthCardShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { AuthErrorBox } from '../../_components/AuthErrorBox';
import { AuthInputField } from '../../_components/AuthInputField';

interface RegisterAccountStepProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  setNameError: (value: string) => void;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  setConfirmPasswordError: (value: string) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit?: () => void;
}

export function RegisterAccountStep({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  nameError,
  emailError,
  passwordError,
  confirmPasswordError,
  setNameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
  error,
  isLoading,
  onSubmit,
}: RegisterAccountStepProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const cardShadow = useAuthCardShadow();
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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
        <AuthInputField
          ref={nameRef}
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          value={name}
          onChangeText={(text) => {
            onNameChange(text);
            if (nameError) setNameError('');
          }}
          error={nameError}
          hasFormError={!!error}
          focused={nameFocused}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          onSubmitEditing={() =>
            requestAnimationFrame(() => emailRef.current?.focus())
          }
          icon="person-outline"
          keyboardType="default"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          blurOnSubmit={false}
          editable={!isLoading}
        />

        <AuthInputField
          ref={emailRef}
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChangeText={(text) => {
            onEmailChange(text);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          hasFormError={!!error}
          focused={emailFocused}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          onSubmitEditing={() =>
            requestAnimationFrame(() => passwordRef.current?.focus())
          }
          icon="mail-outline"
          keyboardType="email-address"
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          blurOnSubmit={false}
          editable={!isLoading}
        />

        <AuthInputField
          ref={passwordRef}
          label={t('auth.password')}
          placeholder={t('auth.createPasswordPlaceholder')}
          value={password}
          onChangeText={(text) => {
            onPasswordChange(text);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          hasFormError={!!error}
          focused={passwordFocused}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onSubmitEditing={() =>
            requestAnimationFrame(() => confirmPasswordRef.current?.focus())
          }
          icon="lock-closed-outline"
          secureTextEntry
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          keyboardType="default"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          blurOnSubmit={false}
          editable={!isLoading}
        />

        <AuthInputField
          ref={confirmPasswordRef}
          label={t('auth.confirmPassword')}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={(text) => {
            onConfirmPasswordChange(text);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          error={confirmPasswordError}
          hasFormError={!!error}
          focused={confirmPasswordFocused}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
          onSubmitEditing={() => onSubmit?.()}
          icon="lock-closed-outline"
          secureTextEntry
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          keyboardType="default"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          blurOnSubmit
          editable={!isLoading}
        />

        {error && <AuthErrorBox message={error} />}
      </VStack>
    </Box>
  );
}

const __expoRouterPrivateRoute_RegisterAccountStep = () => null;

export default __expoRouterPrivateRoute_RegisterAccountStep;
