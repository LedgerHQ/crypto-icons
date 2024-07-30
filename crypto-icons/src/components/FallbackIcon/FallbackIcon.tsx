import React from 'react';
import styled from 'styled-components';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconProps = Pick<CryptoIconProps, 'size' | 'ticker'>;

const Icon = styled.div<{ size: FallbackIconProps['size'] }>`
  border: 1px solid;
  border-radius: 50%;
  border-color: red;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FallbackIcon = ({ ticker, size = '32px' }: FallbackIconProps) => (
  <Icon size={size}>{ticker[0]}</Icon>
);

export default FallbackIcon;
