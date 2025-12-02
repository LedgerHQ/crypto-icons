import React, { FC } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { CryptoIconNativeProps } from '../CryptoIcon/CryptoIcon.types';

type FallbackIconNativeProps = Pick<
  CryptoIconNativeProps,
  'ticker' | 'size' | 'theme' | 'overridesRadius'
>;

const iconSizeToFontSize = (size: number): number => {
  if (size <= 16) return 10;
  if (size <= 20) return 12;
  if (size <= 24) return 14;
  if (size <= 32) return 16;
  if (size <= 40) return 18;
  return 24;
};

const FallbackIconNative: FC<FallbackIconNativeProps> = ({
  ticker,
  size = 16,
  overridesRadius,
}) => {
  const sizeNumber = size;
  const fontSize = iconSizeToFontSize(size);
  const defaultRadius = sizeNumber / 2;
  const borderRadius = overridesRadius !== undefined ? overridesRadius : defaultRadius;

  const containerStyle: ViewStyle = {
    width: sizeNumber,
    height: sizeNumber,
    borderRadius: borderRadius,
    backgroundColor: '#757575',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    color: '#ffffff',
    fontSize: fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{ticker[0]}</Text>
    </View>
  );
};

export default FallbackIconNative;
