import { ledgerLiveCoreTokens } from '@ledgerhq/lumen-design-core';

/**
 * Border radius utilities mirroring Lumen's MediaImage borderRadiusMap.
 * Source: @ledgerhq/lumen-ui-rnative MediaImage.tsx + lumen-design-core primitives.
 */
export type MediaImageSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;
export type MediaImageShape = 'circle' | 'square';

// Maps each MediaImage size to its Lumen border-radius token name.
export const borderRadiusTokenMap = {
  12: 'xs',
  16: 'xs',
  20: 'xs',
  24: 'sm',
  32: 'sm',
  40: 'md',
  48: 'md',
  56: 'lg',
  64: 'lg',
} as const satisfies Record<MediaImageSize, 'xs' | 'sm' | 'md' | 'lg'>;

/**
 * Returns the pixel border radius for a given size and shape.
 * Works for both React (inline style) and React Native (StyleSheet).
 * For circle use '50%' in React web — this returns the numeric equivalent.
 */
export const getBorderRadius = (size: MediaImageSize, shape: MediaImageShape): number =>
  shape === 'circle'
    ? ledgerLiveCoreTokens.borderRadius.full
    : ledgerLiveCoreTokens.borderRadius[borderRadiusTokenMap[size]];

/**
 * Returns the Lumen lx token for a given size and shape.
 * Use with the `lx` prop on Lumen RN Box / Skeleton components.
 */
export const getBorderRadiusToken = (
  size: MediaImageSize,
  shape: MediaImageShape
): 'xs' | 'sm' | 'md' | 'lg' | 'full' => (shape === 'circle' ? 'full' : borderRadiusTokenMap[size]);
