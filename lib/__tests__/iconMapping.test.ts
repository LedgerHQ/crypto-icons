import { coinGeckoMock, ledgerCDNMock } from '../__mocks__/handlers';
import { CRYPTO_ICONS_CDN_BASE } from '../src/constants';
import { getIconUrl, resetIconCacheForTesting } from '../src/iconMapping';

describe('iconMapping', () => {
  beforeEach(() => {
    resetIconCacheForTesting();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should request icon data from Ledger CDN mapping, store the response and not re-fetch', async () => {
    const ledgerIconUrl = await getIconUrl('bitcoin');
    expect(ledgerIconUrl).toBe(`${CRYPTO_ICONS_CDN_BASE}/${ledgerCDNMock?.['bitcoin'].icon}`);

    const ledgerIconUrl2 = await getIconUrl('arbitrum');
    expect(ledgerIconUrl2).toBe(`${CRYPTO_ICONS_CDN_BASE}/${ledgerCDNMock?.['arbitrum'].icon}`);
  });

  it('should request fallback icon data from CoinGecko mapping if icon is not available in existing data, store the response and not re-fetch', async () => {
    const ledgerIconUrl = await getIconUrl('bitcoin');
    expect(ledgerIconUrl).toBe(`${CRYPTO_ICONS_CDN_BASE}/${ledgerCDNMock?.['bitcoin'].icon}`);

    const coinGeckoIconUrl = await getIconUrl('decred');
    expect(coinGeckoIconUrl).toBe(coinGeckoMock?.find((i) => i.ledgerId === 'decred')?.data.img);

    const coinGeckoIconUrl2 = await getIconUrl('particl');
    expect(coinGeckoIconUrl2).toBe(coinGeckoMock?.find((i) => i.ledgerId === 'particl')?.data.img);
  });

  it('should return null if icon is not found in either data', async () => {
    const iconUrl = await getIconUrl('nonexisting');
    expect(iconUrl).toBe(null);
  });
});
