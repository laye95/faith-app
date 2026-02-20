import { Box } from '@/components/ui/box';
import { FormControl } from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons as Ion } from '@expo/vector-icons';
import { forwardRef } from 'react';
import type { TextInput } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type IoniconName = keyof typeof Ion.glyphMap;

interface AuthInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hasFormError?: boolean;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: () => void;
  icon?: IoniconName;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  autoComplete?: 'email' | 'password' | 'new-password' | 'name';
  returnKeyType?: 'next' | 'done';
  blurOnSubmit?: boolean;
  editable?: boolean;
}

export const AuthInputField = forwardRef<TextInput, AuthInputFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      error,
      hasFormError,
      focused,
      onFocus,
      onBlur,
      onSubmitEditing,
      icon = 'mail-outline',
      secureTextEntry = false,
      showPassword,
      onTogglePassword,
      keyboardType = 'default',
      autoCapitalize = 'none',
      autoComplete = 'email',
      returnKeyType = 'next',
      blurOnSubmit = false,
      editable = true,
    },
    ref,
  ) => {
    const theme = useTheme();
    const isDark = theme.isDark;
    const hasError = !!error || !!hasFormError;
    const showToggle = secureTextEntry && onTogglePassword !== undefined;

    const boxStyle = {
      backgroundColor: theme.inputBg,
      borderWidth: hasError ? 1.5 : focused ? 1.5 : 1,
      borderColor: hasError
        ? theme.buttonDecline
        : focused
          ? theme.buttonPrimary
          : theme.cardBorder,
      shadowColor: focused ? theme.buttonPrimary : '#000',
      shadowOffset: { width: 0, height: focused ? 2 : 0 },
      shadowOpacity: focused ? 0.1 : isDark ? 0.15 : 0.03,
      shadowRadius: focused ? 8 : 4,
      elevation: focused ? 2 : 1,
    };

    const iconColor = hasError
      ? theme.buttonDecline
      : focused
        ? theme.buttonPrimary
        : theme.textTertiary;

    return (
      <FormControl isInvalid={hasError}>
        <VStack className="gap-2">
          <Text
            className="text-sm font-medium"
            style={{ color: theme.textSecondary }}
          >
            {label}
          </Text>
          <Box className="overflow-hidden rounded-2xl" style={boxStyle}>
            <Input
              variant="outline"
              size="lg"
              className="h-14 border-0 bg-transparent"
            >
              <InputSlot className="pl-5">
                <InputIcon>
                  <Ion name={icon} size={22} color={iconColor} />
                </InputIcon>
              </InputSlot>
              <InputField
                ref={ref as any}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                blurOnSubmit={blurOnSubmit}
                secureTextEntry={secureTextEntry && !showPassword}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoComplete={autoComplete}
                editable={editable}
                placeholderTextColor={theme.textTertiary}
                className="pl-3 pr-3 text-base"
                style={{ color: theme.textPrimary }}
              />
              {showToggle && (
                <InputSlot onPress={onTogglePassword} className="cursor-pointer pr-5">
                  <InputIcon>
                    <Ion
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={theme.textTertiary}
                    />
                  </InputIcon>
                </InputSlot>
              )}
            </Input>
          </Box>
          {error && (
            <Animated.View entering={FadeIn}>
              <HStack className="mt-1 items-center gap-1.5">
                <Ion name="close-circle" size={14} color={theme.buttonDecline} />
                <Text
                  className="text-xs"
                  style={{ color: theme.buttonDecline }}
                >
                  {error}
                </Text>
              </HStack>
            </Animated.View>
          )}
        </VStack>
      </FormControl>
    );
  },
);

AuthInputField.displayName = 'AuthInputField';
