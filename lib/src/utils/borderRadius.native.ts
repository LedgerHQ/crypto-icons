import type { MediaImageProps } from '@ledgerhq/lumen-ui-rnative';
import {
  borderRadiusTokenMap as sharedBorderRadiusTokenMap,
  getBorderRadiusBase,
  getBorderRadiusTokenBase,
} from './borderRadius.shared';

export type MediaImageSize = NonNullable<MediaImageProps['size']>;
export type MediaImageShape = NonNullable<MediaImageProps['shape']>;

export const borderRadiusTokenMap: Record<MediaImageSize, 'xs' | 'sm' | 'md' | 'lg'> =
  sharedBorderRadiusTokenMap;

export const getBorderRadius = (size: MediaImageSize, shape: MediaImageShape): number =>
  getBorderRadiusBase(size, shape);

export const getBorderRadiusToken = (
  size: MediaImageSize,
  shape: MediaImageShape
): 'xs' | 'sm' | 'md' | 'lg' | 'full' => getBorderRadiusTokenBase(size, shape);
