import React from 'react';
import styled from 'styled-components/native';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconProps = Pick<CryptoIconProps, 'ticker' | 'size'>;

const iconSizeToFontSize: {
  [key in NonNullable<FallbackIconProps['size']>]: number;
} = {
  '16px': 10,
  '24px': 14,
  '32px': 16,
  '40px': 18,
  '48px': 24,
  '56px': 24,
};

const IconWrapper = styled.View`
  height: 100%;
  width: 100%;
  border-radius: 50px;
  background-color: #757575;
`;

const Icon = styled.View<Partial<FallbackIconProps>>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconText = styled.Text<Partial<FallbackIconProps>>`
  color: #ffffff;
  font-weight: 700;
  font-size: ${({ size }) => iconSizeToFontSize[size!]};
`;

const FallbackIcon: React.FC<FallbackIconProps> = ({ ticker, size }) => (
  <IconWrapper>
    <Icon size={size} accessibilityRole="image">
      <IconText size={size}>{ticker[0]}</IconText>
    </Icon>
  </IconWrapper>
);

export default FallbackIcon;
