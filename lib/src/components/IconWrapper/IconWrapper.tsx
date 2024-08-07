import { palettes } from '@ledgerhq/ui-shared';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type IconWrapperProps = Pick<CryptoIconProps, 'size' | 'theme'> & {
  children: ReactNode;
};

const Wrapper = styled.div<IconWrapperProps>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  overflow: hidden;
  border: 1px solid;
  border-radius: 50%;
  border-color: ${({ theme }: { theme: 'dark' | 'light' }) => palettes[theme].opacityDefault.c05};
`;

const IconWrapper: FC<IconWrapperProps> = ({ children, size, theme = 'dark' }) => (
  <Wrapper size={size} theme={theme}>
    {children}
  </Wrapper>
);

export default IconWrapper;
