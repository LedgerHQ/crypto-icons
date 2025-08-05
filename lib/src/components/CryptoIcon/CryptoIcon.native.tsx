import { palettes } from '@ledgerhq/ui-shared';
import React, { FC } from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';
import { useCryptoIcon } from '../../hooks/useCryptoIcon';
import FallbackIconNative from '../FallbackIcon/FallbackIcon.native';
import { CryptoIconNativeProps } from './CryptoIcon.types';

const CryptoIconNative: FC<CryptoIconNativeProps> = ({
  ledgerId,
  ticker,
  size = 16,
  theme = 'dark',
  network,
  backgroundColor,
}) => {
  const { iconUrl, networkUrl, loading, error } = useCryptoIcon({
    ledgerId,
    network,
  });

  const defaultBackgroundColor = palettes[theme].background.main;
  const finalBackgroundColor = backgroundColor || defaultBackgroundColor;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    position: 'relative',
  };

  const iconStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const networkIconSize = size / 2.8;
  const container = networkIconSize + 7;
  const networkContainerStyle: ViewStyle = {
    position: 'absolute',
    right: -3,
    bottom: -3,
    alignItems: 'center',
    justifyContent: 'center',
    width: container,
    height: container,
    borderRadius: (networkIconSize + 8) / 2,
    backgroundColor: finalBackgroundColor,
  };

  const networkIconStyle: ImageStyle = {
    width: networkIconSize,
    height: networkIconSize,
    borderRadius: networkIconSize / 2,
  };

  const skeletonStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: palettes[theme].opacityDefault.c05,
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (loading) {
    return <View style={skeletonStyle} />;
  }

  if (error) {
    return <FallbackIconNative ticker={ticker} size={size} />;
  }

  return (
    <View style={containerStyle}>
      {iconUrl ? (
        <Image source={{ uri: iconUrl }} style={iconStyle} />
      ) : (
        <FallbackIconNative ticker={ticker} size={size} />
      )}
      {networkUrl && (
        <View style={networkContainerStyle}>
          <Image source={{ uri: networkUrl }} style={networkIconStyle} />
        </View>
      )}
    </View>
  );
};

export default CryptoIconNative;
