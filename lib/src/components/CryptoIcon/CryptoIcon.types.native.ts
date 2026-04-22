import { DotSymbol, MediaImage } from '@ledgerhq/lumen-ui-rnative';
import { ComponentProps } from 'react';

export type CryptoIconProps = {
  ledgerId: string;
  ticker: string;
  network?: string;
  badgePosition?: ComponentProps<typeof DotSymbol>['pin'];
  size?: ComponentProps<typeof MediaImage>['size'];
  shape?: ComponentProps<typeof MediaImage>['shape'];
  alt?: string;
  testID?: string;
};
