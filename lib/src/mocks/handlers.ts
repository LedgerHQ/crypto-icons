import { rest } from 'msw';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../constants';

export const ledgerCDNMock = {
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

export const coinGeckoMock = [
  {
    $type: 'Coin',
    ledgerId: 'bitcoin',
    providerId: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    status: 'Ok',
    reason: null,
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/1/large/bitcoin.png',
      marketCapRank: 1,
    },
  },
  {
    $type: 'Coin',
    ledgerId: 'arbitrum',
    providerId: 'ethereum',
    name: 'Arbitrum',
    ticker: 'ETH',
    status: 'Ok',
    reason: 'Overridden',
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/279/large/ethereum.png',
      marketCapRank: 2,
    },
  },
  {
    $type: 'Coin',
    ledgerId: 'decred',
    providerId: 'decred',
    name: 'Decred',
    ticker: 'DCR',
    status: 'Ok',
    reason: null,
    data: {
      img: 'https://proxycgassets.api.live.ledger.com/coins/images/329/large/decred.png',
      marketCapRank: 253,
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
