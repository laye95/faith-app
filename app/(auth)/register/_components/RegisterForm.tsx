import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useCardShadow } from '@/hooks/useShadows';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { bzzt } from '@/utils/haptics';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validators';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { AuthErrorBox } from '../../_components/AuthErrorBox';
import { AuthInputField } from '../../_components/AuthInputField';
import { AuthSubmitButton } from '../../_components/AuthSubmitButton';

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const cardShadow = useCardShadow();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    bzzt();
    const nameErr = validateName(name, t);
    const emailErr = validateEmail(email, t);
    const passwordErr = validatePassword(password, t);
    const confirmErr = validateConfirmPassword(confirmPassword, password, t);
    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);
    if (nameErr || emailErr || passwordErr || confirmErr) return;
    await onSubmit({ name, email, password, confirmPassword });
  };

  return (
    <Box
      className="rounded-3xl p-8"
      style={{
        backgroundColor: theme.cardBg,
        ...cardShadow,
      }}
    >
      <VStack className="gap-6">
        <AuthInputField
          ref={nameRef}
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError('');
          }}
          error={nameError}
          hasFormError={!!error}
          focused={nameFocused}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          onSubmitEditing={() => emailRef.current?.focus()}
          icon="person-outline"
          keyboardType="default"
          autoCapitalize="words"
          autoComplete="name"
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
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          hasFormError={!!error}
          focused={emailFocused}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          icon="mail-outline"
          keyboardType="email-address"
          autoComplete="email"
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
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          hasFormError={!!error}
          focused={passwordFocused}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          icon="lock-closed-outline"
          secureTextEntry
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          keyboardType="default"
          autoComplete="new-password"
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
            setConfirmPassword(text);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          error={confirmPasswordError}
          hasFormError={!!error}
          focused={confirmPasswordFocused}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
          onSubmitEditing={handleSubmit}
          icon="lock-closed-outline"
          secureTextEntry
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          keyboardType="default"
          autoComplete="new-password"
          returnKeyType="done"
          blurOnSubmit
          editable={!isLoading}
        />

        {error && <AuthErrorBox message={error} />}

        <AuthSubmitButton
          label={t('auth.createAccount')}
          loadingLabel={t('auth.creating')}
          isLoading={isLoading}
          onPress={handleSubmit}
        />
      </VStack>
    </Box>
  );
}
