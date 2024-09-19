import { ThemeNames } from '@ledgerhq/ui-shared';
import { Currency } from '@ledgerhq/wallet-api-client';

export type CryptoIconProps = {
  ledgerId: Currency['id'];
  ticker: Currency['ticker'];
  theme?: ThemeNames;
  size?: '16px' | '24px' | '32px' | '40px' | '48px' | '56px';
  network?: Currency['id'];
};
