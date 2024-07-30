import { useEffect, useState } from 'react';
import { CRYPTO_ICONS_CDN_BASE } from '../constants';

const useCryptoIcons = (ledgerId: string) => {
  const [icon, setIcon] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getCryptoIcon = async () => {
    try {
      const response = await fetch(`${CRYPTO_ICONS_CDN_BASE}/index.json`, {
        cache: 'force-cache',
      });
      const data = await response.json();

      if (data[ledgerId]) {
        setIcon(`${CRYPTO_ICONS_CDN_BASE}/${data[ledgerId].icon}`);
        setLoading(false);
        return;
      }

      throw new Error();
    } catch (e) {
      try {
        console.log('get gecko fallback');
        throw new Error();
      } catch (error) {
        console.log('get ticker fallback');
        setError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!icon) {
      getCryptoIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledgerId]);

  return { icon, loading, error };
};

export default useCryptoIcons;
