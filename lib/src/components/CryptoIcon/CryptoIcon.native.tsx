import React, { FC } from 'react';
import { Box, DotSymbol, MediaImage, Skeleton, mediaImageDotSizeMap } from '@ledgerhq/lumen-ui-rnative';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
import { getBorderRadiusToken } from '../../utils/borderRadius.native';
import FallbackIconNative from '../FallbackIcon/FallbackIcon.native';
import type { CryptoIconProps } from './CryptoIcon.types.native';

const CryptoIcon: FC<CryptoIconProps> = ({
  ledgerId,
  ticker,
  network,
  badgePosition = 'bottom-end',
  size = 48,
  shape = 'circle',
  alt,
  testID,
}) => {
  const { iconUrl, networkUrl, loading } = useCryptoIcon({ ledgerId, network });
  const fallbackLetter = (ticker[0] ?? '?').toUpperCase();

  if (loading) {
    return (
      <Skeleton
        style={{ width: size, height: size }}
        lx={{ borderRadius: getBorderRadiusToken(size, shape) }}
        testID={testID}
      />
    );
  }

  const image = iconUrl ? (
    <MediaImage src={iconUrl} size={size} shape={shape} alt={alt} testID={testID} />
  ) : (
    <FallbackIconNative letter={fallbackLetter} size={size} shape={shape} testID={testID} />
  );

  if (networkUrl) {
    return (
      <Box lx={{ position: 'relative' }} style={{ width: size, height: size }}>
        <DotSymbol src={networkUrl} pin={badgePosition} size={mediaImageDotSizeMap[size]}>
          {image}
        </DotSymbol>
      </Box>
    );
  }

  return image;
};

export default CryptoIcon;
