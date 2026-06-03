import type { DotSymbolProps, MediaImageProps } from '@ledgerhq/lumen-ui-rnative';

export type CryptoIconProps = {
  ledgerId: string;
  ticker: string;
  network?: string;
  badgePosition?: DotSymbolProps['pin'];
  size?: MediaImageProps['size'];
  shape?: MediaImageProps['shape'];
  alt?: string;
  disabled?: boolean;
  testID?: string;
};
