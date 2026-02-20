export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
] as const;

export type SupportedLocale = (typeof LANGUAGES)[number]['code'];

export const SUPPORTED_LOCALES: SupportedLocale[] = LANGUAGES.map((l) => l.code);

export const LANGUAGES_FOR_UI = LANGUAGES.filter((l) => l.code !== 'en') as readonly (typeof LANGUAGES)[number][];

export const DISPLAY_LOCALES: SupportedLocale[] = LANGUAGES_FOR_UI.map((l) => l.code);

export function isSupportedLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LOCALES.includes(code as SupportedLocale);
}

export function isDisplayLocale(code: string): code is SupportedLocale {
  return DISPLAY_LOCALES.includes(code as SupportedLocale);
}
