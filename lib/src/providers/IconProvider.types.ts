import { Currency } from '@ledgerhq/wallet-api-client';

type CoinGeckoMapping = {
  ledgerId: Currency['id'];
  data: {
    img: string;
  };
}[];

type LedgerMapping = {
  [key: Currency['id']]: {
    icon: string;
  };
};

type SetLedgerMappingAction = {
  type: 'setLedgerMapping';
  value: LedgerMapping;
};

type SetCoinGeckoMappingAction = {
  type: 'setCoinGeckoMapping';
  value: CoinGeckoMapping;
};

type SetLoadingAction = {
  type: 'setLoadingLedgerMapping' | 'setLoadingCoinGeckoMapping';
  value: boolean;
};

export type State = {
  ledgerMapping: LedgerMapping;
  coinGeckoMapping: CoinGeckoMapping;
  loadingLedgerMapping: boolean;
  loadingCoinGeckoMapping: boolean;
};

export type Actions = SetLedgerMappingAction | SetCoinGeckoMappingAction | SetLoadingAction;
