import { DotSymbol, MediaImage, Skeleton, mediaImageDotSizeMap } from '@ledgerhq/lumen-ui-react';
import React, { FC } from 'react';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
import { getBorderRadius } from '../../utils/borderRadius';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import { CryptoIconProps } from './CryptoIcon.types';

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
  const testProps = testID !== undefined ? { 'data-testid': testID } : {};

  if (loading) {
    return (
      <Skeleton
        style={{
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? '50%' : getBorderRadius(size, shape),
        }}
        {...testProps}
      />
    );
  }

  const image = iconUrl ? (
    <MediaImage src={iconUrl} size={size} shape={shape} alt={alt} {...testProps} />
  ) : (
    <FallbackIcon letter={fallbackLetter} size={size} shape={shape} testID={testID} />
  );

  if (networkUrl) {
    return (
      <DotSymbol src={networkUrl} pin={badgePosition} size={mediaImageDotSizeMap[size]}>
        {image}
      </DotSymbol>
    );
  }

  return image;
};

export default CryptoIcon;
