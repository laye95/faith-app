import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import nl from './locales/nl.json';
import bg from './locales/bg.json';
import hi from './locales/hi.json';
import id from './locales/id.json';

import {
  isSupportedLocale,
  isDisplayLocale,
  LANGUAGES,
  LANGUAGES_FOR_UI,
  SUPPORTED_LOCALES,
  DISPLAY_LOCALES,
  type SupportedLocale,
} from './localeConfig';

export {
  isSupportedLocale,
  isDisplayLocale,
  LANGUAGES,
  LANGUAGES_FOR_UI,
  SUPPORTED_LOCALES,
  DISPLAY_LOCALES,
};
export type { SupportedLocale };

const i18n = new I18n({
  en,
  nl,
  bg,
  hi,
  id,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const STORAGE_KEY = '@faith_app:language';

export const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error getting stored language:', error);
    return null;
  }
};

export const setStoredLanguage = async (locale: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, locale);
    i18n.locale = locale;
  } catch (error) {
    console.error('Error storing language:', error);
  }
};

export const initializeI18n = async (): Promise<void> => {
  const storedLanguage = await getStoredLanguage();
  const deviceLanguage =
    Localization.getLocales()[0]?.languageCode?.split(/[-_]/)[0] || 'en';

  let locale: SupportedLocale = 'nl';
  if (storedLanguage && SUPPORTED_LOCALES.includes(storedLanguage as SupportedLocale)) {
    const stored = storedLanguage as SupportedLocale;
    locale = stored === 'en' ? 'nl' : stored;
    if (stored === 'en') {
      await AsyncStorage.setItem(STORAGE_KEY, 'nl');
    }
  } else if (DISPLAY_LOCALES.includes(deviceLanguage as SupportedLocale)) {
    locale = deviceLanguage as SupportedLocale;
  } else if (deviceLanguage === 'en') {
    locale = 'nl';
  }

  i18n.locale = locale;
};

export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

export const setLanguage = async (locale: SupportedLocale): Promise<void> => {
  await setStoredLanguage(locale);
};

export default i18n;
