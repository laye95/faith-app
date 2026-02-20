export function validateEmail(
  value: string,
  t: (key: string) => string,
): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) return t('auth.emailRequired');
  if (!emailRegex.test(value.trim())) return t('auth.emailInvalid');
  return '';
}

export function validatePassword(
  value: string,
  t: (key: string) => string,
): string {
  if (!value) return t('auth.passwordRequired');
  if (value.length < 6) return t('auth.passwordMinLength');
  return '';
}

export function validateName(
  value: string,
  t: (key: string) => string,
): string {
  const trimmed = value.trim();
  if (!trimmed) return t('auth.nameRequired');
  if (trimmed.length < 2) return t('auth.nameMinLength');
  return '';
}

export function validateConfirmPassword(
  value: string,
  original: string,
  t: (key: string) => string,
): string {
  if (!value) return t('auth.confirmPasswordRequired');
  if (value !== original) return t('auth.passwordsDoNotMatch');
  return '';
}
