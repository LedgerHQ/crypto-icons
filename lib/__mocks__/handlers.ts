import { Currency } from '@ledgerhq/wallet-api-client';
import { rest } from 'msw';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../src/constants';
import { LedgerMapping } from '../src/iconMapping';

export const ledgerCDNMock: LedgerMapping = {
  bitcoin: {
    icon: 'BTC.png',
  },
  arbitrum: {
    icon: 'ETH.png',
  },
  base: {
    icon: 'ETH.png',
  },
};

// Mock data in API format (array), which gets transformed to map internally
export const coinGeckoMock: Array<{ ledgerId: Currency['id']; data: { img: string } }> = [
  {
    ledgerId: 'bitcoin',
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/1/large/bitcoin.png',
    },
  },
  {
    ledgerId: 'arbitrum',
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/279/large/ethereum.png',
    },
  },
  {
    ledgerId: 'decred',
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/329/large/decred.png',
    },
  },
  {
    ledgerId: 'particl',
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/839/large/Particl.png',
    },
  },
];

export const handlers = [
  rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(ledgerCDNMock));
  }),

  rest.get(COINGECKO_MAPPED_ASSETS_URL, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(coinGeckoMock));
  }),
];
