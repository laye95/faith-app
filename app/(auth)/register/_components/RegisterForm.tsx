import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { bzzt } from "@/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import type { RefObject } from "react";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

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
  const isDark = theme.isDark;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const validateName = (value: string) => {
    if (!value.trim()) return t("auth.nameRequired");
    if (value.trim().length < 2) return t("auth.nameMinLength");
    return "";
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return t("auth.emailRequired");
    if (!emailRegex.test(value.trim())) return t("auth.emailInvalid");
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return t("auth.passwordRequired");
    if (value.length < 6) return t("auth.passwordMinLength");
    return "";
  };

  const validateConfirmPassword = (value: string, original: string) => {
    if (!value) return t("auth.confirmPasswordRequired");
    if (value !== original) return t("auth.passwordsDoNotMatch");
    return "";
  };

  const handleSubmit = async () => {
    bzzt();
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);
    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);
    if (nameErr || emailErr || passwordErr || confirmErr) return;
    await onSubmit({ name, email, password, confirmPassword });
  };

  const inputBoxStyle = (hasError: boolean, focused: boolean) => ({
    backgroundColor: isDark ? theme.cardBg : "#ffffff",
    borderWidth: hasError || error ? 1.5 : focused ? 1.5 : 1,
    borderColor:
      hasError || error
        ? theme.buttonDecline
        : focused
          ? theme.buttonPrimary
          : isDark
            ? theme.cardBorder
            : "#e5e7eb",
    shadowColor: focused ? theme.buttonPrimary : "#000",
    shadowOffset: { width: 0, height: focused ? 2 : 0 },
    shadowOpacity: focused ? 0.1 : isDark ? 0.15 : 0.03,
    shadowRadius: focused ? 8 : 4,
    elevation: focused ? 2 : 1,
  });

  const fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error: string;
    setError: (v: string) => void;
    focused: boolean;
    setFocused: (v: boolean) => void;
    icon: "person-outline" | "mail-outline" | "lock-closed-outline";
    secure: boolean;
    showToggle: boolean;
    toggle?: boolean;
    setToggle?: (v: boolean) => void;
    keyboardType: "default" | "email-address";
    autoComplete: "name" | "email" | "new-password";
    ref: RefObject<TextInput | null>;
    returnKeyType: "next" | "done";
    blurOnSubmit: boolean;
    onSubmitEditing: () => void;
  }> = [
    {
      key: "fullName",
      label: t("auth.fullName"),
      placeholder: t("auth.fullNamePlaceholder"),
      value: name,
      onChange: setName,
      error: nameError,
      setError: setNameError,
      focused: nameFocused,
      setFocused: setNameFocused,
      icon: "person-outline" as const,
      secure: false,
      showToggle: false,
      keyboardType: "default" as const,
      autoComplete: "name" as const,
      ref: nameRef,
      returnKeyType: "next" as const,
      blurOnSubmit: false,
      onSubmitEditing: () => emailRef.current?.focus(),
    },
    {
      key: "email",
      label: t("auth.email"),
      placeholder: t("auth.emailPlaceholder"),
      value: email,
      onChange: setEmail,
      error: emailError,
      setError: setEmailError,
      focused: emailFocused,
      setFocused: setEmailFocused,
      icon: "mail-outline" as const,
      secure: false,
      showToggle: false,
      keyboardType: "email-address" as const,
      autoComplete: "email" as const,
      ref: emailRef,
      returnKeyType: "next" as const,
      blurOnSubmit: false,
      onSubmitEditing: () => passwordRef.current?.focus(),
    },
    {
      key: "password",
      label: t("auth.password"),
      placeholder: t("auth.createPasswordPlaceholder"),
      value: password,
      onChange: setPassword,
      error: passwordError,
      setError: setPasswordError,
      focused: passwordFocused,
      setFocused: setPasswordFocused,
      icon: "lock-closed-outline" as const,
      secure: !showPassword,
      showToggle: true,
      toggle: showPassword,
      setToggle: setShowPassword,
      keyboardType: "default" as const,
      autoComplete: "new-password" as const,
      ref: passwordRef,
      returnKeyType: "next" as const,
      blurOnSubmit: false,
      onSubmitEditing: () => confirmPasswordRef.current?.focus(),
    },
    {
      key: "confirmPassword",
      label: t("auth.confirmPassword"),
      placeholder: t("auth.confirmPasswordPlaceholder"),
      value: confirmPassword,
      onChange: setConfirmPassword,
      error: confirmPasswordError,
      setError: setConfirmPasswordError,
      focused: confirmPasswordFocused,
      setFocused: setConfirmPasswordFocused,
      icon: "lock-closed-outline" as const,
      secure: !showConfirmPassword,
      showToggle: true,
      toggle: showConfirmPassword,
      setToggle: setShowConfirmPassword,
      keyboardType: "default" as const,
      autoComplete: "new-password" as const,
      ref: confirmPasswordRef,
      returnKeyType: "done" as const,
      blurOnSubmit: true,
      onSubmitEditing: handleSubmit,
    },
  ];

  return (
    <Box
      className="rounded-3xl p-8"
      style={{
        backgroundColor: theme.cardBg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <VStack className="gap-6">
        {fields.map((f) => (
          <FormControl key={f.key} isInvalid={!!f.error || !!error}>
            <VStack className="gap-2">
              <Text
                className="text-sm font-medium"
                style={{ color: theme.textSecondary }}
              >
                {f.label}
              </Text>
              <Box
                className="overflow-hidden rounded-2xl"
                style={inputBoxStyle(!!f.error, f.focused)}
              >
                <Input
                  variant="outline"
                  size="lg"
                  className="h-14 border-0 bg-transparent"
                >
                  <InputSlot className="pl-5">
                    <InputIcon>
                      <Ionicons
                        name={f.icon}
                        size={22}
                        color={
                          f.error || error
                            ? theme.buttonDecline
                            : f.focused
                              ? theme.buttonPrimary
                              : theme.textTertiary
                        }
                      />
                    </InputIcon>
                  </InputSlot>
                  <InputField
                    ref={f.ref as any}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChangeText={(text) => {
                      f.onChange(text);
                      if (f.error) f.setError("");
                    }}
                    onFocus={() => f.setFocused(true)}
                    onBlur={() => f.setFocused(false)}
                    onSubmitEditing={f.onSubmitEditing}
                    returnKeyType={f.returnKeyType}
                    blurOnSubmit={f.blurOnSubmit}
                    secureTextEntry={f.secure}
                    keyboardType={f.keyboardType}
                    autoCapitalize={
                      f.autoComplete === "name" ? "words" : "none"
                    }
                    autoComplete={f.autoComplete}
                    editable={!isLoading}
                    placeholderTextColor={theme.textTertiary}
                    className="pl-3 pr-3 text-base"
                    style={{ color: theme.textPrimary }}
                  />
                  {f.showToggle && f.setToggle !== undefined && (
                    <InputSlot
                      onPress={() => f.setToggle!(!f.toggle)}
                      className="cursor-pointer pr-5"
                    >
                      <InputIcon>
                        <Ionicons
                          name={f.toggle ? "eye-off-outline" : "eye-outline"}
                          size={22}
                          color={theme.textTertiary}
                        />
                      </InputIcon>
                    </InputSlot>
                  )}
                </Input>
              </Box>
              {f.error && (
                <Animated.View entering={FadeIn}>
                  <HStack className="mt-1 items-center gap-1.5">
                    <Ionicons
                      name="close-circle"
                      size={14}
                      color={theme.buttonDecline}
                    />
                    <Text
                      className="text-xs"
                      style={{ color: theme.buttonDecline }}
                    >
                      {f.error}
                    </Text>
                  </HStack>
                </Animated.View>
              )}
            </VStack>
          </FormControl>
        ))}

        {error && (
          <Animated.View entering={FadeIn}>
            <Box
              className="rounded-xl border p-4"
              style={{
                backgroundColor: theme.badgeError,
                borderColor: theme.buttonDecline,
                opacity: 0.9,
              }}
            >
              <HStack className="items-center gap-3">
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={theme.buttonDecline}
                />
                <Text
                  className="flex-1 text-sm"
                  style={{ color: theme.textPrimary }}
                >
                  {error}
                </Text>
              </HStack>
            </Box>
          </Animated.View>
        )}

        <VStack className="mt-4 gap-4">
          <Button
            onPress={handleSubmit}
            action="primary"
            variant="solid"
            size="lg"
            className="h-14 cursor-pointer rounded-2xl"
            isDisabled={isLoading}
            style={{
              backgroundColor: theme.buttonPrimary,
              shadowColor: theme.buttonPrimary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {isLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText
              className="text-base font-semibold"
              style={{ color: theme.buttonPrimaryContrast }}
            >
              {isLoading ? t("auth.creating") : t("auth.createAccount")}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
