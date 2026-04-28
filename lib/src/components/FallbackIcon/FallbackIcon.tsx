import { type MediaImageProps, useTheme } from '@ledgerhq/lumen-ui-react';
import React, { FC } from 'react';
import { getBorderRadius } from '../../utils/borderRadius';
import { getFontSize } from '../../utils/fontSize';

type FallbackIconProps = {
  letter: string;
  size?: MediaImageProps['size'];
  shape?: MediaImageProps['shape'];
  testID?: string;
};

// This component will be removed in the future once Lumen exposes the fallback mechanism
const FallbackIcon: FC<FallbackIconProps> = ({ letter, size = 48, shape = 'circle', testID }) => {
  const theme = useTheme();

  return (
    <div
      className="flex items-center justify-center select-none text-base bg-muted"
      style={{
        width: size,
        height: size,
        borderRadius: getBorderRadius(size, shape),
        fontSize: getFontSize(size),
        fontWeight: 500,
        outline: `1px solid ${theme.theme.colors.border.icon}`,
        outlineOffset: -1,
      }}
      role="img"
      aria-label={letter}
      data-testid={testID}
    >
      {letter}
    </div>
  );
};

export default FallbackIcon;
