import React from 'react';
import styled from 'styled-components';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconProps = Pick<CryptoIconProps, 'ticker'>;

const Icon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #717070;
  color: #ffffff;
`;
//needs responsive font size

const FallbackIcon = ({ ticker }: FallbackIconProps) => (
  <Icon data-testid="fallback-icon">{ticker[0]}</Icon>
);

export default FallbackIcon;
