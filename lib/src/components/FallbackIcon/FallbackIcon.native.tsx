import { Box, type MediaImageProps, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import React, { FC } from 'react';
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
}) => {
  const theme = useTheme();

  return (
    <Box
      lx={{
        backgroundColor: 'muted',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getBorderRadiusToken(size, shape),
        flexShrink: 0,
      }}
      style={{
        width: size,
        height: size,
        outlineColor: theme.theme.colors.border.icon,
        outlineWidth: 1,
        outlineStyle: 'solid',
        outlineOffset: -1,
      }}
      accessibilityLabel={letter}
      accessibilityRole="image"
      testID={testID}
    >
      <Text
        lx={{ color: 'base' }}
        style={{ fontWeight: 500, fontSize: getFontSize(size), lineHeight: 32 }}
      >
        {letter}
      </Text>
    </Box>
  );
};

export default FallbackIconNative;
