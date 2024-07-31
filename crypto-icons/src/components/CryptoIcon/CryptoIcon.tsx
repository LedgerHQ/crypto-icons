import React, { FC } from 'react';
import styled from 'styled-components';
import useCryptoIcons from '../../hooks/useCryptoIcons';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import IconWrapper from '../IconWrapper/IconWrapper';
import { CryptoIconProps } from './CryptoIcon.types';

const Icon = styled.img`
  height: 100%;
  width: 100%;
`;

const CryptoIcon: FC<CryptoIconProps> = ({
  ledgerId,
  ticker,
  size = '16px',
  theme,
}) => {
  const { icon, error } = useCryptoIcons(ledgerId);

  return (
    <IconWrapper size={size} theme={theme}>
      {icon && <Icon data-testid="icon" src={icon} alt={ticker} />}
      {error && <FallbackIcon ticker={ticker} size={size} />}
    </IconWrapper>
  );
};

export default CryptoIcon;
