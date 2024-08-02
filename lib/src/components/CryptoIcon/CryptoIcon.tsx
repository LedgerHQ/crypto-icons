import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import IconContext from '../../providers/IconProvider';
import FallbackIcon from '../FallbackIcon/FallbackIcon';
import IconWrapper from '../IconWrapper/IconWrapper';
import { CryptoIconProps } from './CryptoIcon.types';

const Icon = styled.img`
  height: 100%;
  width: 100%;
`;

const CryptoIcon: FC<CryptoIconProps> = ({ ledgerId, ticker, size = '16px', theme }) => {
  const { getIcon, loading } = useContext(IconContext);

  if (loading) return null;

  const icon = getIcon(ledgerId);

  return (
    <IconWrapper size={size} theme={theme}>
      {icon ? <Icon src={icon} alt={ticker} /> : <FallbackIcon ticker={ticker} size={size} />}
    </IconWrapper>
  );
};

export default CryptoIcon;
