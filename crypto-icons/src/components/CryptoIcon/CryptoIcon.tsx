import React, { FC } from 'react';
import styled from 'styled-components';
import useCryptoIcons from '../../hooks/useCryptoIcons';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import { CryptoIconProps } from './CryptoIcon.types';

const Icon = styled.img<{ size: CryptoIconProps['size'] }>`
  border: 1px solid;
  border-radius: 50%;
  border-color: red;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`;

const CryptoIcon: FC<CryptoIconProps> = ({
  ledgerId,
  ticker,
  size = '32px',
}) => {
  const { icon, loading, error } = useCryptoIcons(ledgerId);

  if (loading) return null;

  if (icon) {
    return <Icon src={icon} size={size} />;
  }

  if (error) {
    return <FallbackIcon ticker={ticker} size={size} />;
  }
};

export default CryptoIcon;
