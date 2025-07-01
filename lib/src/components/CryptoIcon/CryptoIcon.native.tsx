import { palettes } from '@ledgerhq/ui-shared';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, View, ViewStyle } from 'react-native';
import { getIconUrl } from '../../iconMapping';
import FallbackIconNative from '../FallbackIcon/FallbackIcon.native';
import { CryptoIconNativeProps } from './CryptoIcon.types';

const CryptoIconNative: FC<CryptoIconNativeProps> = ({
  ledgerId,
  ticker,
  size = 16,
  theme = 'dark',
  network,
}) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const loadIcon = async () => {
      setNetworkUrl(null);
      setHasError(false);
      const iconsToResolve = [getIconUrl(ledgerId)];
      if (network) iconsToResolve.push(getIconUrl(network));

      try {
        const [url, networkUrlResolved] = await Promise.all(iconsToResolve);
        setIconUrl(url);
        if (network && networkUrlResolved) setNetworkUrl(networkUrlResolved);
      } catch (e) {
        console.error(e);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [network, ledgerId]);

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
    backgroundColor: palettes[theme].background.main,
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
    return (
      <View style={skeletonStyle}>
        <ActivityIndicator size="small" color={palettes[theme].opacityDefault.c50} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {iconUrl && !hasError ? (
        <Image source={{ uri: iconUrl }} style={iconStyle} onError={() => setHasError(true)} />
      ) : (
        <FallbackIconNative ticker={ticker} size={size} theme={theme} />
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
