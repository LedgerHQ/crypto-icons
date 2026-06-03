import { DotSymbol, MediaImage, mediaImageDotSizeMap } from '@ledgerhq/lumen-ui-react';
import React, { FC } from 'react';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
import type { CryptoIconProps } from './CryptoIcon.types';

const CryptoIcon: FC<CryptoIconProps> = ({
  ledgerId,
  ticker,
  network,
  badgePosition = 'bottom-end',
  size = 48,
  shape = 'circle',
  alt,
  disabled = false,
  testID,
}) => {
  const { iconUrl, networkUrl, loading } = useCryptoIcon({ ledgerId, network });
  const fallbackLetter = (ticker[0] ?? '?').toUpperCase();
  const testProps = testID !== undefined ? { 'data-testid': testID } : {};

  const Image = (
    <MediaImage
      loading={loading}
      fallback={fallbackLetter}
      src={iconUrl ?? undefined}
      size={size}
      shape={shape}
      imgLoading="lazy"
      alt={alt}
      disabled={disabled}
      {...testProps}
    />
  );

  if (networkUrl) {
    return (
      <DotSymbol
        src={networkUrl}
        pin={badgePosition}
        size={mediaImageDotSizeMap[size]}
        disabled={disabled}
      >
        {Image}
      </DotSymbol>
    );
  }

  return Image;
};

export default CryptoIcon;
