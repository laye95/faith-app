/**
 * Single source of truth for app colors.
 * Edit this file only to change primary, secondary, and semantic colors globally.
 * useTheme and gluestack config both derive from these tokens.
 */

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
};

export const primary = {
  light: '#171717',
  dark: '#FAFAFA',
  lightRgb: hexToRgb('#171717'),
  darkRgb: hexToRgb('#FAFAFA'),
  mutedLight: 'rgba(23, 23, 23, 0.2)',
  mutedDark: 'rgba(250, 250, 250, 0.25)',
} as const;

export const primaryContrast = {
  light: '#FFFFFF',
  dark: '#171717',
} as const;

export const decline = {
  light: '#b91c1c',
  dark: '#f87171',
  contrast: '#FFFFFF',
} as const;

export const success = '#4d7c59';

export const accept = {
  light: '#10b981',
  dark: '#10b981',
} as const;

export const error = {
  light: '#b91c1c',
  dark: '#f87171',
} as const;

export const quizIncorrect = {
  light: '#b91c1c',
  dark: '#b91c1c',
  bgLight: '#fef2f2',
  bgDark: '#450a0a',
} as const;

export const quizCorrect = {
  light: '#4d7c59',
  dark: '#4d7c59',
  bgLight: '#dcfce7',
  bgDark: '#064e3b',
} as const;

export const primaryScaleLight = {
  400: '115 115 115',
  500: primary.lightRgb,
  600: '23 23 23',
  700: '10 10 10',
};

export const primaryScaleDark = {
  400: '115 115 115',
  500: primary.darkRgb,
  600: '250 250 250',
  700: '252 252 252',
};

export const declineRgb = {
  light: hexToRgb(decline.light),
  dark: hexToRgb(decline.dark),
} as const;
