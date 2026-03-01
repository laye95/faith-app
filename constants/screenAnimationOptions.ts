import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const STACK_ANIMATION = {
  push: "slide_from_right" as const,
  pop: "slide_from_left" as const,
  none: "none" as const,
} as const;

export function stackScreenOptions(
  overrides?: Partial<NativeStackNavigationOptions>,
): NativeStackNavigationOptions {
  return {
    animation: STACK_ANIMATION.push,
    ...overrides,
  };
}

export function rootScreenOptions(
  overrides?: Partial<NativeStackNavigationOptions>,
): NativeStackNavigationOptions {
  return {
    animation: STACK_ANIMATION.pop,
    ...overrides,
  };
}
