import React, { FC } from 'react';
import styled from 'styled-components';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconProps = Pick<CryptoIconProps, 'ticker' | 'size' | 'overridesRadius'>;

const iconSizeToFontSize: {
  [key in NonNullable<FallbackIconProps['size']>]: string;
} = {
  '16px': '10px',
  '20px': '12px',
  '24px': '14px',
  '32px': '16px',
  '40px': '18px',
  '48px': '24px',
  '56px': '24px',
};

const Icon = styled.div<Partial<FallbackIconProps>>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: ${({ size }) => iconSizeToFontSize[size!]};
  font-family: 'Inter', sans-serif;
`;

const IconWrapper = styled.div<Pick<FallbackIconProps, 'overridesRadius'>>`
  height: 100%;
  width: 100%;
  border-radius: ${({ overridesRadius }) => (overridesRadius ? overridesRadius : '50%')};
  background-color: #757575;
`;

const FallbackIcon: FC<FallbackIconProps> = ({ ticker, size, overridesRadius }) => (
  <IconWrapper overridesRadius={overridesRadius}>
    <Icon size={size} role="img">
      {ticker[0]}
    </Icon>
  </IconWrapper>
);

export default FallbackIcon;
