import { forwardRef } from 'react';
import { View } from 'react-native';
import { LANGUAGES_FOR_UI, type SupportedLocale } from '@/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import {
  SettingsDropdown,
  type SettingsDropdownOption,
  type SettingsDropdownRef,
} from '@/components/ui/SettingsDropdown';

export type LanguageSwitcherRef = SettingsDropdownRef;

const LANGUAGE_OPTIONS: SettingsDropdownOption<SupportedLocale>[] =
  LANGUAGES_FOR_UI.map((lang) => ({
    value: lang.code,
    label: lang.nativeName,
    flag: lang.flag,
  }));

interface LanguageSwitcherProps {
  variant?: 'default' | 'inline';
  fullWidth?: boolean;
  measureRef?: React.RefObject<View | null>;
}

export const LanguageSwitcher = forwardRef<
  LanguageSwitcherRef,
  LanguageSwitcherProps
>(function LanguageSwitcher(
  { variant = 'default', fullWidth = false, measureRef },
  ref,
) {
  const { locale, changeLanguage } = useTranslation();

  const displayValue =
    LANGUAGES_FOR_UI.some((l) => l.code === locale) ? locale : (LANGUAGES_FOR_UI[0]?.code ?? locale);

  return (
    <SettingsDropdown<SupportedLocale>
      ref={ref}
      options={LANGUAGE_OPTIONS}
      value={displayValue}
      onSelect={async (v) => {
        await changeLanguage(v);
      }}
      measureRef={measureRef}
      fullWidth={fullWidth}
      variant={variant}
    />
  );
});
