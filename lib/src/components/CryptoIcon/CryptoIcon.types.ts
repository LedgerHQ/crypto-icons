import { ThemeNames } from '@ledgerhq/ui-shared';
import { Currency } from '@ledgerhq/wallet-api-client';

/**
 * @reference [Figma](https://www.figma.com/design/zSkvGGiqcnhywp2l3HTHxA/1.Symbol-Library?node-id=6-3803&t=W0J5MFxuaIyDedJU-0)
 */
export type CryptoIconProps = {
  ledgerId: Currency['id'];
  ticker: Currency['ticker'];
  theme?: ThemeNames;
  size?: '16px' | '20px' | '24px' | '32px' | '40px' | '48px' | '56px';
  network?: Currency['id'];
};
