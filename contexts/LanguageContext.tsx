import {
  getCurrentLanguage,
  getStoredLanguage,
  initializeI18n,
  isSupportedLocale,
  setLanguage as setI18nLanguage,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/i18n';
import { userSettingsService } from '@/services/api/userSettingsService';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from './AuthContext';

interface LanguageContextType {
  locale: SupportedLocale;
  changeLanguage: (locale: SupportedLocale) => Promise<void>;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  changeLanguage: async () => {},
  isInitialized: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await initializeI18n();

      if (user?.id) {
        try {
          const dbLanguage = await userSettingsService.getSetting<string>(
            user.id,
            'language',
          );

          if (dbLanguage && isSupportedLocale(dbLanguage)) {
            await setI18nLanguage(dbLanguage as SupportedLocale);
            setLocale(dbLanguage as SupportedLocale);
          } else {
            const storedLanguage = await getStoredLanguage();
            const currentLang = (storedLanguage ||
              getCurrentLanguage()) as SupportedLocale;
            const validLang = isSupportedLocale(currentLang) ? currentLang : 'en';
            setLocale(validLang);

            if (storedLanguage && isSupportedLocale(storedLanguage)) {
              try {
                await userSettingsService.setSetting(
                  user.id,
                  'language',
                  storedLanguage,
                );
              } catch (settingError: unknown) {
                const err = settingError as { requiresLogout?: boolean; code?: string };
                if (err?.requiresLogout || err?.code === 'USER_RECORD_NOT_FOUND') {
                  await signOut();
                  router.replace('/');
                  return;
                }
                console.warn(
                  'Failed to save language preference (user may not be ready yet)',
                );
              }
            }
          }
        } catch (error) {
          console.error('Error loading language from database:', error);
          const currentLang = getCurrentLanguage() as SupportedLocale;
          setLocale(isSupportedLocale(currentLang) ? currentLang : 'en');
        }
      } else {
        const currentLang = getCurrentLanguage() as SupportedLocale;
        setLocale(isSupportedLocale(currentLang) ? currentLang : 'en');
      }

      setIsInitialized(true);
    };
    init();
  }, [user?.id]);

  const changeLanguage = useCallback(
    async (newLocale: SupportedLocale) => {
      await setI18nLanguage(newLocale);
      setLocale(newLocale);

      if (user?.id) {
        try {
          await userSettingsService.setSetting(user.id, 'language', newLocale);
        } catch (error: unknown) {
          const err = error as { requiresLogout?: boolean; code?: string };
          if (err?.requiresLogout || err?.code === 'USER_RECORD_NOT_FOUND') {
            await signOut();
            router.replace('/');
            return;
          }
          console.error('Error saving language to database', error);
        }
      }
    },
    [user?.id],
  );

  const value = useMemo(
    () => ({
      locale,
      changeLanguage,
      isInitialized,
    }),
    [locale, changeLanguage, isInitialized],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
