import { useEffect, useState } from 'react';
import { getIconUrl } from '../iconMapping';

interface UseCryptoIconProps {
  ledgerId: string;
  network?: string;
}

interface UseCryptoIconReturn {
  iconUrl: string | null;
  networkUrl: string | null;
  loading: boolean;
  hasError: boolean;
  setHasError: (error: boolean) => void;
}

export const useCryptoIcon = ({ ledgerId, network }: UseCryptoIconProps): UseCryptoIconReturn => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const loadIcon = async () => {
      setNetworkUrl(null);
      setHasError(false);
      const iconsToResolve = [getIconUrl(ledgerId)];
      if (network) iconsToResolve.push(getIconUrl(network));

      try {
        const [url, networkUrlResolved] = await Promise.all(iconsToResolve);
        setIconUrl(url);
        if (network && networkUrlResolved) setNetworkUrl(networkUrlResolved);
      } catch (e) {
        console.error(e);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadIcon();
  }, [network, ledgerId]);

  return {
    iconUrl,
    networkUrl,
    loading,
    hasError,
    setHasError,
  };
};
