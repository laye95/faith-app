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

export function validatePhone(
  value: string,
  t: (key: string) => string,
): string {
  if (!value.trim()) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length < 8) return t('auth.phoneMinLength');
  return '';
}

export function validateBirthdate(
  value: string | null | undefined,
  t: (key: string) => string,
): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return t('auth.birthdateInvalid');
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) return t('auth.birthdateNotFuture');
  const minDate = new Date(1900, 0, 1);
  if (date < minDate) return t('auth.birthdateInvalid');
  return '';
}
