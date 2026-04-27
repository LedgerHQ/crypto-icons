import { ledgerLiveCoreTokens } from '@ledgerhq/lumen-design-core';

export type BorderRadiusToken = 'xs' | 'sm' | 'md' | 'lg';
export type MediaImageShape = 'circle' | 'square';

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
} as const;

export type MediaImageSize = keyof typeof borderRadiusTokenMap;

export const getBorderRadiusBase = (size: MediaImageSize, shape: MediaImageShape): number =>
  shape === 'circle'
    ? ledgerLiveCoreTokens.borderRadius.full
    : ledgerLiveCoreTokens.borderRadius[borderRadiusTokenMap[size]];

export const getBorderRadiusTokenBase = (
  size: MediaImageSize,
  shape: MediaImageShape
): BorderRadiusToken | 'full' => (shape === 'circle' ? 'full' : borderRadiusTokenMap[size]);
