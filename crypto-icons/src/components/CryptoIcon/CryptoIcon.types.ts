import { Currency } from '@ledgerhq/wallet-api-client';

export type CryptoIconProps = {
  ledgerId: Currency['id'];
  ticker: Currency['ticker'];
  size?: '16px' | '32px';
  theme?: 'dark' | 'light';
};
