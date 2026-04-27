import type { MediaImageSize } from './borderRadius.shared';

export const fontSizeMap: Record<MediaImageSize, number> = {
  12: 10,
  16: 10,
  20: 12,
  24: 14,
  32: 16,
  40: 18,
  48: 24,
  56: 24,
  64: 24,
};

export const getFontSize = (size: MediaImageSize): number => fontSizeMap[size];
