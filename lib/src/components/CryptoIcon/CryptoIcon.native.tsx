import { Box, DotSymbol, MediaImage, mediaImageDotSizeMap } from '@ledgerhq/lumen-ui-rnative';
import React, { FC } from 'react';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
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

  const Image = (
    <MediaImage
      loading={loading}
      fallback={fallbackLetter}
      src={iconUrl ?? undefined}
      size={size}
      shape={shape}
      alt={alt}
      testID={testID}
    />
  );

  if (networkUrl) {
    return (
      <Box lx={{ position: 'relative' }} style={{ width: size, height: size }}>
        <DotSymbol src={networkUrl} pin={badgePosition} size={mediaImageDotSizeMap[size]}>
          {Image}
        </DotSymbol>
      </Box>
    );
  }

  return Image;
};

export default CryptoIcon;
