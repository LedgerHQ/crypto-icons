import { Box, MediaImage, Text } from '@ledgerhq/lumen-ui-rnative';
import React, { ComponentProps, FC } from 'react';
import { getBorderRadiusToken } from '../../utils/borderRadius';
import { getFontSize } from '../../utils/fontSize';

type FallbackIconProps = {
  letter: string;
  size?: ComponentProps<typeof MediaImage>['size'];
  shape?: ComponentProps<typeof MediaImage>['shape'];
  testID?: string;
};

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
    <Text lx={{ color: "base" }} style={{ fontWeight: 500, fontSize: getFontSize(size), lineHeight: 32 }}>
      {letter}
    </Text>
  </Box>
);

export default FallbackIconNative;
