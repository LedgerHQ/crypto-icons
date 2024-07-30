import { rest } from 'msw';
import { CRYPTO_ICONS_CDN_BASE } from '../constants';

export const handlers = [
  rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        bitcoin: {
          icon: 'BTC.png',
        },
        arbitrum: {
          icon: 'ETH.png',
        },
        base: {
          icon: 'ETH.png',
        },
      }),
    );
  }),
];
