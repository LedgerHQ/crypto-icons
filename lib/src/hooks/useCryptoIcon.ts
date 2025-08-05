import { useCallback, useEffect, useState } from 'react';
import { getIconUrl } from '../iconMapping';

interface UseCryptoIconProps {
  ledgerId: string;
  network?: string;
}

interface UseCryptoIconReturn {
  iconUrl: string | null;
  networkUrl: string | null;
  loading: boolean;
  error: Error | null;
}

export const useCryptoIcon = ({ ledgerId, network }: UseCryptoIconProps): UseCryptoIconReturn => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadIcon = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNetworkUrl(null);

    const iconsToResolve = [getIconUrl(ledgerId)];
    if (network) iconsToResolve.push(getIconUrl(network));

    try {
      const [url, networkUrlResolved] = await Promise.all(iconsToResolve);
      setIconUrl(url);
      if (network && networkUrlResolved) setNetworkUrl(networkUrlResolved);
    } catch (e) {
      const errorInstance = e instanceof Error ? e : new Error('Failed to load icon');
      setError(errorInstance);
      console.error('Failed to load crypto icon:', errorInstance);
    } finally {
      setLoading(false);
    }
  }, [ledgerId, network]);

  useEffect(() => {
    loadIcon();
  }, [loadIcon]);

  return {
    iconUrl,
    networkUrl,
    loading,
    error,
  };
};
