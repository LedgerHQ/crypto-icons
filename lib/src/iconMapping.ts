import { Currency } from '@ledgerhq/wallet-api-client';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from './constants';

export type LedgerMapping = {
  [key: Currency['id']]: {
    icon: string;
  };
} | null;

export type CoinGeckoMapping = Record<string, string> | null;

type CoinGeckoRawData = Array<{
  ledgerId: Currency['id'];
  data: {
    img: string;
  };
}>;

let ledgerMapping: LedgerMapping = null;
let coinGeckoMapping: CoinGeckoMapping = null;
let fetchingLedgerMapping: boolean = false;
let fetchingCoinGeckoMapping: boolean = false;
let iconMappingFetchPromise: Promise<LedgerMapping> | null = null;
let coinGeckoIconMappingFetchPromise: Promise<CoinGeckoMapping> | null = null;

const fetchIconMapping = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`);
  }

  return res.json();
};

const initLedgerIconMapping = async () => {
  if (ledgerMapping) {
    return ledgerMapping;
  }

  if (fetchingLedgerMapping) {
    return iconMappingFetchPromise;
  }

  fetchingLedgerMapping = true;

  iconMappingFetchPromise = fetchIconMapping<LedgerMapping>(`${CRYPTO_ICONS_CDN_BASE}/index.json`)
    .then((data) => {
      ledgerMapping = data;
      return ledgerMapping;
    })
    .catch(() => {
      return null;
    })
    .finally(() => {
      fetchingLedgerMapping = false;
      iconMappingFetchPromise = null;
    });

  return iconMappingFetchPromise;
};

const initCoinGeckoIconMapping = async () => {
  if (coinGeckoMapping) {
    return coinGeckoMapping;
  }

  if (fetchingCoinGeckoMapping) {
    return coinGeckoIconMappingFetchPromise;
  }

  fetchingCoinGeckoMapping = true;

  coinGeckoIconMappingFetchPromise = fetchIconMapping<CoinGeckoRawData>(COINGECKO_MAPPED_ASSETS_URL)
    .then((data) => {
      // Transform array into map for O(1) lookup
      const mapping: Record<string, string> = {};
      for (const asset of data) {
        if (asset.ledgerId && asset.data?.img) {
          mapping[asset.ledgerId] = asset.data.img;
        }
      }
      coinGeckoMapping = mapping;
      return coinGeckoMapping;
    })
    .catch(() => {
      return null;
    })
    .finally(() => {
      fetchingCoinGeckoMapping = false;
      coinGeckoIconMappingFetchPromise = null;
    });

  return coinGeckoIconMappingFetchPromise;
};

export const getIconUrl = async (ledgerId: Currency['id']): Promise<string | null> => {
  if (!ledgerMapping) {
    await initLedgerIconMapping();
  }

  const maybeLedgerIcon = ledgerMapping?.[ledgerId];
  if (maybeLedgerIcon) {
    return `${CRYPTO_ICONS_CDN_BASE}/${maybeLedgerIcon.icon}`;
  }

  if (!coinGeckoMapping) {
    await initCoinGeckoIconMapping();
  }

  if (coinGeckoMapping?.[ledgerId]) {
    return coinGeckoMapping[ledgerId];
  }

  return null;
};

//Jest test helper
export const resetIconCacheForTesting = () => {
  ledgerMapping = null;
  coinGeckoMapping = null;
  fetchingLedgerMapping = false;
  fetchingCoinGeckoMapping = false;
  iconMappingFetchPromise = null;
  coinGeckoIconMappingFetchPromise = null;
};
