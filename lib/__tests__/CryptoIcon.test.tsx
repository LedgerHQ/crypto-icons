import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { coinGeckoMock } from '../__mocks__/handlers';
import { server } from '../__mocks__/node';
import CryptoIcon from '../src/components/CryptoIcon';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../src/constants';
import { resetIconCacheForTesting as resetHookCache } from '../src/hooks/useCryptoIcon';
import { resetIconCacheForTesting as resetIconMappingCache } from '../src/iconMapping';

console.error = jest.fn();

describe('CryptoIcon', () => {
  beforeEach(() => {
    resetIconMappingCache();
    resetHookCache();
  });

  describe('loading state', () => {
    it('shows skeleton on initial render before icon resolves', () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });

  describe('Ledger icon', () => {
    it('fetches index.json and renders icon from CDN', async () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveAttribute('src', `${CRYPTO_ICONS_CDN_BASE}/BTC.png`);
    });
  });

  describe('CoinGecko fallback', () => {
    it('renders CoinGecko icon when CDN index.json fails', async () => {
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
        coinGeckoMock?.find((i) => i.ledgerId === 'bitcoin')?.data.img
      );
    });

    it('renders CoinGecko icon when ledgerId not in CDN', async () => {
      render(<CryptoIcon ledgerId="decred" ticker="DCR" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        coinGeckoMock?.find((i) => i.ledgerId === 'decred')?.data.img
      );
    });
  });

  describe('letter fallback', () => {
    it('renders first letter of ticker when both CDN and CoinGecko fail', async () => {
      server.use(
        rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
          return res(ctx.status(500));
        }),
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

    it('renders ? when ticker is empty', async () => {
      server.use(
        rest.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`, (_, res, ctx) => {
          return res(ctx.status(500));
        }),
        rest.get(COINGECKO_MAPPED_ASSETS_URL, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<CryptoIcon ledgerId="bitcoin" ticker="" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.getByRole('img')).toHaveTextContent('?');
    });
  });

  describe('network badge', () => {
    it('renders network badge when network prop is provided', async () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" network="arbitrum" />);

      await waitFor(() => {
        const badge = screen.getByTestId('network-badge');
        expect(badge).toBeInTheDocument();
      });

      expect(screen.getByTestId('network-badge')).toHaveAttribute(
        'src',
        `${CRYPTO_ICONS_CDN_BASE}/ETH.png`
      );
    });

    it('does not render network badge when network prop is absent', async () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('network-badge')).not.toBeInTheDocument();
    });
  });
});
