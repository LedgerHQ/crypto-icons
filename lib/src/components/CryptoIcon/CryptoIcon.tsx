import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIconUrl } from '../../iconMapping';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import IconWrapper from '../IconWrapper/IconWrapper';
import { CryptoIconProps } from './CryptoIcon.types';

const Icon = styled.img`
  height: 100%;
  width: 100%;
`;

const CryptoIcon: FC<CryptoIconProps> = ({ ledgerId, ticker, size = '16px', theme }) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const url = await getIconUrl(ledgerId);
        setIconUrl(url);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [ledgerId]);

  if (loading) return null;

  return (
    <IconWrapper size={size} theme={theme}>
      {iconUrl ? <Icon src={iconUrl} alt={ticker} /> : <FallbackIcon ticker={ticker} size={size} />}
    </IconWrapper>
  );
};

export default CryptoIcon;
