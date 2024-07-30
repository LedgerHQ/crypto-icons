import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../../constants';
import { resetIconCacheForTesting } from '../../iconMapping';
import { coinGeckoMock } from '../../mocks/handlers';
import { server } from '../../mocks/node';
import CryptoIcon from './CryptoIcon';

describe('CryptoIcon', () => {
  beforeEach(() => {
    resetIconCacheForTesting();
  });

  describe('Ledger icon', () => {
    it('should fetch index.json containing icon mapping and render icon from CDN', async () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveAttribute('src', `${CRYPTO_ICONS_CDN_BASE}/BTC.png`);
    });
  });

  describe('CoinGecko fallback', () => {
    it('should fetch from CoinGecko and render fallback icon if request to Ledger CDN fails', async () => {
      server.use(
        rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        coinGeckoMock.find((i) => i.ledgerId === 'bitcoin')?.data.img
      );
    });

    it('should fetch from CoinGecko and render fallback icon if not found in Ledger CDN', async () => {
      render(<CryptoIcon ledgerId="decred" ticker="DCR" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        coinGeckoMock.find((i) => i.ledgerId === 'decred')?.data.img
      );
    });
  });

  describe('ticker icon fallback', () => {
    it('should use ticker icon fallback if both Ledger and CoinGecko icons are not available', async () => {
      server.use(
        rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      server.use(
        rest.get(COINGECKO_MAPPED_ASSETS_URL, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveTextContent('B');
    });
  });
});
