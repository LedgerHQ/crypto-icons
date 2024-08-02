import { Currency } from '@ledgerhq/wallet-api-client';
import axios from 'axios';
import React, { createContext, ReactNode, Reducer, useEffect, useReducer } from 'react';
import { COINGECKO_MAPPED_ASSETS_URL, CRYPTO_ICONS_CDN_BASE } from '../constants';
import { Actions, State } from './IconProvider.types';

export const IconContext = createContext<{
  getIcon: (ledgerId: Currency['id']) => string | null;
  loading: boolean;
}>({ getIcon: () => null, loading: true });

const initialState: State = {
  ledgerMapping: {},
  coinGeckoMapping: [],
  loadingLedgerMapping: true,
  loadingCoinGeckoMapping: true,
};

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'setLedgerMapping':
      return { ...state, ledgerMapping: action.value };
    case 'setCoinGeckoMapping':
      return { ...state, coinGeckoMapping: action.value };
    case 'setLoadingLedgerMapping':
      return { ...state, loadingLedgerMapping: action.value };
    case 'setLoadingCoinGeckoMapping':
      return { ...state, loadingCoinGeckoMapping: action.value };
    default:
      return state;
  }
};

export const IconProvider = ({ children }: { children: ReactNode }) => {
  const [
    { ledgerMapping, coinGeckoMapping, loadingLedgerMapping, loadingCoinGeckoMapping },
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, initialState);
  const cache: { [key: Currency['id']]: string } = {};

  const fetchLedgerMapping = async () => {
    try {
      const { data } = await axios.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`);
      dispatch({
        type: 'setLedgerMapping',
        value: data,
      });
    } catch (e) {
      // do nothing
    } finally {
      dispatch({
        type: 'setLoadingLedgerMapping',
        value: false,
      });
    }
  };

  const fetchCoinGeckoMapping = async () => {
    try {
      const { data } = await axios.get(COINGECKO_MAPPED_ASSETS_URL);
      dispatch({
        type: 'setCoinGeckoMapping',
        value: data,
      });
    } catch (e) {
      // do nothing
    } finally {
      dispatch({
        type: 'setLoadingCoinGeckoMapping',
        value: false,
      });
    }
  };

  useEffect(() => {
    fetchLedgerMapping();
    fetchCoinGeckoMapping();
  }, []);

  const getIcon = (ledgerId: Currency['id']) => {
    if (cache[ledgerId]) {
      return cache[ledgerId];
    }

    if (ledgerMapping && ledgerMapping[ledgerId]) {
      cache[ledgerId] = `${CRYPTO_ICONS_CDN_BASE}/${ledgerMapping[ledgerId].icon}`;
      return cache[ledgerId];
    }

    const coinGeckoURL = coinGeckoMapping?.find((i) => i.ledgerId === ledgerId)?.data.img;

    if (coinGeckoMapping && coinGeckoURL) {
      cache[ledgerId] = coinGeckoURL;
      return cache[ledgerId];
    }

    return null;
  };

  return (
    <IconContext.Provider
      value={{ getIcon, loading: loadingLedgerMapping || loadingCoinGeckoMapping }}
    >
      {children}
    </IconContext.Provider>
  );
};

export default IconContext;
