import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type IconWrapperProps = Pick<CryptoIconProps, 'size' | 'theme'> & {
  children: ReactNode;
};

const Wrapper = styled.View<IconWrapperProps>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  overflow: hidden;
  position: relative;
`;

export const RoundedIcon = styled.Image<Pick<CryptoIconProps, 'theme'>>`
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const IconWrapper: React.FC<IconWrapperProps> = ({ children, size, theme }) => (
  <Wrapper size={size} theme={theme}>
    {children}
  </Wrapper>
);

export default IconWrapper;
