import { Currency } from '@ledgerhq/wallet-api-client';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from './constants';

export type LedgerMapping = {
  [key: Currency['id']]: {
    icon: string;
  };
} | null;

export type CoinGeckoMapping =
  | {
      ledgerId: Currency['id'];
      data: {
        img: string;
      };
    }[]
  | null;

type CryptoIconsFetchPromise = Promise<LedgerMapping | CoinGeckoMapping> | null;

let ledgerMapping: LedgerMapping = null;
let coinGeckoMapping: CoinGeckoMapping = null;
let fetchingLedgerMapping: boolean = false;
let fetchingCoinGeckoMapping: boolean = false;
let cryptoIconsFetchPromise: CryptoIconsFetchPromise = null;

const fetchIconMapping = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Response status: ${res.status}`);
  }

  return res.json();
};

const setLedgerIconMapping = async () => {
  if (ledgerMapping) {
    return ledgerMapping;
  }

  if (fetchingLedgerMapping) {
    return cryptoIconsFetchPromise;
  }

  fetchingLedgerMapping = true;

  cryptoIconsFetchPromise = fetchIconMapping(`${CRYPTO_ICONS_CDN_BASE}/index.json`)
    .then((data) => {
      ledgerMapping = data;
      return ledgerMapping;
    })
    .catch(() => {
      return null;
    })
    .finally(() => {
      fetchingLedgerMapping = false;
    });

  return cryptoIconsFetchPromise;
};

const setCoinGeckoIconMapping = async () => {
  if (coinGeckoMapping) {
    return coinGeckoMapping;
  }

  if (fetchingCoinGeckoMapping) {
    return cryptoIconsFetchPromise;
  }

  fetchingCoinGeckoMapping = true;

  cryptoIconsFetchPromise = fetchIconMapping(COINGECKO_MAPPED_ASSETS_URL)
    .then((data) => {
      coinGeckoMapping = data;
      return coinGeckoMapping;
    })
    .catch(() => {
      return null;
    })
    .finally(() => {
      fetchingCoinGeckoMapping = false;
    });

  return cryptoIconsFetchPromise;
};

export const getIconUrl = async (ledgerId: Currency['id']): Promise<string | null> => {
  if (!ledgerMapping) {
    await setLedgerIconMapping();
  }

  if (ledgerMapping?.[ledgerId]) {
    return `${CRYPTO_ICONS_CDN_BASE}/${ledgerMapping[ledgerId].icon}`;
  }

  if (!coinGeckoMapping) {
    await setCoinGeckoIconMapping();
  }

  const coinGeckoAsset = coinGeckoMapping?.find((asset) => asset.ledgerId === ledgerId);
  if (coinGeckoAsset?.data?.img) {
    return coinGeckoAsset.data.img;
  }

  return null;
};

//Jest test helper
export const resetIconCacheForTesting = () => {
  ledgerMapping = null;
  coinGeckoMapping = null;
};
