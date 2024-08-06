import { rest } from 'msw';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../src/constants';
import { CoinGeckoMapping, LedgerMapping } from '../src/iconMapping';

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

export const coinGeckoMock: CoinGeckoMapping = [
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
];

export const handlers = [
  rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(ledgerCDNMock));
  }),

  rest.get(COINGECKO_MAPPED_ASSETS_URL, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(coinGeckoMock));
  }),
];
