import {
  DotSymbol,
  MediaImage,
  Skeleton,
  mediaImageDotSizeMap,
  useTheme,
} from '@ledgerhq/lumen-ui-react';
import React, { FC } from 'react';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
import { getBorderRadius } from '../../utils/borderRadius';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import type { CryptoIconProps } from './CryptoIcon.types';

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
  const theme = useTheme();
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
    <MediaImage
      src={iconUrl}
      size={size}
      shape={shape}
      alt={alt}
      style={{ outline: `1px solid ${theme.theme.colors.border.icon}`, outlineOffset: -1 }}
      {...testProps}
    />
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
