import axios from 'axios';
import { useEffect, useState } from 'react';
import { CRYPTO_ICONS_CDN_BASE } from '../constants';

const useCryptoIcons = (ledgerId: string) => {
  const [icon, setIcon] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  const getCryptoIcon = async () => {
    try {
      const response = await axios.get(`${CRYPTO_ICONS_CDN_BASE}/index.json`);

      if (response.data[ledgerId]) {
        setIcon(`${CRYPTO_ICONS_CDN_BASE}/${response.data[ledgerId].icon}`);
        return;
      }

      throw new Error();
    } catch (e) {
      try {
        console.log('get coingecko fallback');
        throw new Error();
      } catch (error) {
        console.log('get ticker fallback');
        setError(true);
      }
    }
  };

  useEffect(() => {
    if (!icon) {
      getCryptoIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledgerId]);

  return { icon, error };
};

export default useCryptoIcons;
