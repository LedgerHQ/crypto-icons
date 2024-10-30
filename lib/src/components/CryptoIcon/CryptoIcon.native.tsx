import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { getIconUrl } from '../../iconMapping';
import FallbackIcon from '../FallbackIcon/FallbackIcon.native';
import IconWrapper, { RoundedIcon } from '../IconWrapper/IconWrapper.native';
import { CryptoIconProps } from './CryptoIcon.types';

const Icon = styled(RoundedIcon)<{ hasNetwork: boolean }>`
  height: 100%;
  width: 100%;
  ${({ hasNetwork }) =>
    hasNetwork
      ? 'mask-image: radial-gradient(circle closest-side at 81.5% 81.5%, transparent 125%, white 130%);'
      : ''}
`;

const NetworkIcon = styled(RoundedIcon)<Pick<CryptoIconProps, 'size'>>`
  height: calc(${({ size }) => size} / 2.8);
  width: calc(${({ size }) => size} / 2.8);
  position: absolute;
  right: 0px;
  bottom: 0px;
`;

const CryptoIcon: React.FC<CryptoIconProps> = ({
  ledgerId,
  ticker,
  size = '16px',
  theme = 'dark',
  network,
}) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadIcon = async () => {
      setNetworkUrl(null);
      const iconsToResolve = [getIconUrl(ledgerId)];
      if (network) iconsToResolve.push(getIconUrl(network));
      try {
        const [url, networkUrlResolved] = await Promise.all(iconsToResolve);
        setIconUrl(url);
        if (network && networkUrlResolved) setNetworkUrl(networkUrlResolved);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [network, ledgerId]);

  if (loading) return null;

  return (
    <IconWrapper size={size} theme={theme}>
      {iconUrl ? (
        <Icon
          theme={theme}
          source={{ uri: iconUrl }}
          accessibilityLabel={ticker}
          hasNetwork={!!networkUrl}
        />
      ) : (
        <FallbackIcon ticker={ticker} size={size} />
      )}
      {networkUrl ? <NetworkIcon theme={theme} size={size} source={{ uri: networkUrl }} /> : null}
    </IconWrapper>
  );
};

export default CryptoIcon;
