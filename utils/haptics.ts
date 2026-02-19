import * as Haptics from 'expo-haptics';

export function bzzt(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function bzztMedium(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
