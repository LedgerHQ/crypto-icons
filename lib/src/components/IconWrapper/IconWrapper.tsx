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
  position: relative;
`;

export const RoundedIcon = styled.img<Pick<CryptoIconProps, 'theme' | 'overridesRadius'>>`
  border-radius: ${({ overridesRadius }) => (overridesRadius ? overridesRadius : '50%')};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  outline: 1px auto ${({ theme }: { theme: 'dark' | 'light' }) => palettes[theme].opacityDefault.c05};
  outline-offset: -1px;
  outline-style: solid;
}
`;

export const Skeleton = styled.div<Pick<CryptoIconProps, 'size' | 'theme' | 'overridesRadius'>>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  border-radius: ${({ overridesRadius }) => (overridesRadius ? overridesRadius : '50%')};
  background-color: ${({ theme }: { theme: 'dark' | 'light' }) =>
    palettes[theme].opacityDefault.c05};
`;

const IconWrapper: FC<IconWrapperProps> = ({ children, size, theme }) => (
  <Wrapper size={size} theme={theme}>
    {children}
  </Wrapper>
);

export default IconWrapper;
