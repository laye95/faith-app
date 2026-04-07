import { DOTTED_RING_CONTAINER } from './dottedRing';

export const BRANDED_LOGO_WIDTH = 280;

export const BRANDED_LOGO_HEIGHT = 88;

export const BRANDED_SLOGAN_FONT_SIZE = 15;

export const BRANDED_SLOGAN_LINE_HEIGHT = 22;

export const BRANDED_SLOGAN_LETTER_SPACING = 3;

export const BRANDED_SLOGAN_LINE_COUNT = 3;

export const BRANDED_BOTTOM_SPACER_BELOW_SPINNER = 20;

export const BRANDED_SPINNER_SIZE = DOTTED_RING_CONTAINER;

export function brandedSplashBottomBlockHeightPts(): number {
  return (
    BRANDED_SPINNER_SIZE +
    BRANDED_BOTTOM_SPACER_BELOW_SPINNER +
    BRANDED_SLOGAN_LINE_COUNT * BRANDED_SLOGAN_LINE_HEIGHT
  );
}

export const BRANDED_SPLASH_REFERENCE_WIDTH_PTS = 414;

export const BRANDED_SPLASH_REFERENCE_HEIGHT_PTS = 736;

export const BRANDED_SPLASH_NATIVE_EXPORT_SCALE = 3;

/** Fixed bottom inset for native splash PNG; runtime uses useSafeAreaInsets. */
export const STATIC_SPLASH_BOTTOM_PADDING_PTS = Math.max(20, 34) + 32;

