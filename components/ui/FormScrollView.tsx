import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface FormScrollViewProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  bottomOffset?: number;
  extraKeyboardSpace?: number;
}

export function FormScrollView({
  children,
  contentContainerStyle,
  style,
  bottomOffset = 24,
  extraKeyboardSpace = 20,
}: FormScrollViewProps) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={bottomOffset}
      extraKeyboardSpace={extraKeyboardSpace}
      contentContainerStyle={contentContainerStyle}
      style={[{ flex: 1 }, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
