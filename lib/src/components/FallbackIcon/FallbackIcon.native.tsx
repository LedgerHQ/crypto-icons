import React, { FC } from 'react';
import { Box, type MediaImageProps, Text } from '@ledgerhq/lumen-ui-rnative';
import { getBorderRadiusToken } from '../../utils/borderRadius.native';
import { getFontSize } from '../../utils/fontSize';

type FallbackIconProps = {
  letter: string;
  size?: MediaImageProps['size'];
  shape?: MediaImageProps['shape'];
  testID?: string;
};

// This component will be removed in the future once Lumen exposes the fallback mechanism
const FallbackIconNative: FC<FallbackIconProps> = ({
  letter,
  size = 48,
  shape = 'circle',
  testID,
}) => (
  <Box
    lx={{
      backgroundColor: 'muted',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: getBorderRadiusToken(size, shape),
      flexShrink: 0,
    }}
    style={{ width: size, height: size }}
    accessibilityLabel={letter}
    accessibilityRole="image"
    testID={testID}
  >
    <Text
      lx={{ color: 'base' }}
      style={{ fontWeight: 500, fontSize: getFontSize(size), lineHeight: 0 }}
    >
      {letter}
    </Text>
  </Box>
);

export default FallbackIconNative;
