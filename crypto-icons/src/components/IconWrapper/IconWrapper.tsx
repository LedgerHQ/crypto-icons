import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { CryptoIconProps } from '../CryptoIcon/CryptoIcon.types';

type IconWrapperProps = Pick<CryptoIconProps, 'size'> & { children: ReactNode };

const Wrapper = styled.div<{ size: IconWrapperProps['size'] }>`
  border: 1px solid;
  border-radius: 50%;
  border-color: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`;

//needs theme access
//dark c05: "rgba(255, 255, 255, 0.05)",
//light c05: "rgba(0, 0, 0, 0.05)",

const IconWrapper = ({ children, size }: IconWrapperProps) => (
  <Wrapper size={size}>{children}</Wrapper>
);

export default IconWrapper;
