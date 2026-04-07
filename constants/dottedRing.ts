export const DOTTED_RING_DOT_COUNT = 8;

export const DOTTED_RING_CONTAINER = 96;

export const DOTTED_RING_RADIUS = 36;

export const DOTTED_RING_DOT_SIZE = 8;

export const DOTTED_RING_OPACITIES = [
  1, 0.75, 0.55, 0.38, 0.25, 0.16, 0.1, 0.14,
] as const;

export interface DottedRingDotLayout {
  left: number;
  top: number;
  opacity: number;
}

export interface DottedRingDotCenter {
  cx: number;
  cy: number;
  opacity: number;
}

export function getDottedRingDotLayouts(
  logicalScale: number = 1,
): DottedRingDotLayout[] {
  const container = DOTTED_RING_CONTAINER * logicalScale;
  const radius = DOTTED_RING_RADIUS * logicalScale;
  const dotSize = DOTTED_RING_DOT_SIZE * logicalScale;
  return DOTTED_RING_OPACITIES.map((opacity, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / DOTTED_RING_DOT_COUNT;
    const left =
      container / 2 + radius * Math.cos(angle) - dotSize / 2;
    const top =
      container / 2 + radius * Math.sin(angle) - dotSize / 2;
    return { left, top, opacity };
  });
}

export function getDottedRingDotCentersInLocalSpace(
  logicalScale: number = 1,
): DottedRingDotCenter[] {
  const dotSize = DOTTED_RING_DOT_SIZE * logicalScale;
  return getDottedRingDotLayouts(logicalScale).map(({ left, top, opacity }) => ({
    cx: left + dotSize / 2,
    cy: top + dotSize / 2,
    opacity,
  }));
}
