import React, { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import InterBold from '../../fonts/Inter-Bold.woff2';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconProps = Pick<CryptoIconProps, 'ticker' | 'size'>;

const InterBoldFont = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    src: url(${InterBold}) format('woff2');
  }
`;

const iconSizeToFontSize: {
  [key in NonNullable<FallbackIconProps['size']>]: string;
} = {
  '16px': '10px',
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
  background-color: #757575;
  color: #ffffff;
  font-weight: 700;
  font-size: ${({ size }) => iconSizeToFontSize[size!]};
  font-family: 'Inter', sans-serif;
`;

const FallbackIcon: FC<FallbackIconProps> = ({ ticker, size }) => (
  <>
    <InterBoldFont />
    <Icon size={size} role="img">
      {ticker[0]}
    </Icon>
  </>
);

export default FallbackIcon;
