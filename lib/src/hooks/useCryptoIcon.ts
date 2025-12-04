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
  error: Error | null;
}

interface CachedResult {
  iconUrl: string | null;
  networkUrl: string | null;
}

// Lightweight in-memory cache for resolved icon URLs
const iconCache = new Map<string, CachedResult>();

const getCacheKey = (ledgerId: string, network?: string): string => {
  return `${ledgerId}:${network || ''}`;
};

// Jest test helper
export const resetIconCacheForTesting = () => {
  iconCache.clear();
};

export const useCryptoIcon = ({ ledgerId, network }: UseCryptoIconProps): UseCryptoIconReturn => {
  const cacheKey = getCacheKey(ledgerId, network);
  const cached = iconCache.get(cacheKey);

  const [iconUrl, setIconUrl] = useState<string | null>(cached?.iconUrl ?? null);
  const [networkUrl, setNetworkUrl] = useState<string | null>(cached?.networkUrl ?? null);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check cache again inside effect (in case it was populated by another instance)
    const cachedResult = iconCache.get(cacheKey);
    if (cachedResult) {
      setIconUrl(cachedResult.iconUrl);
      setNetworkUrl(cachedResult.networkUrl);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const loadIcon = async () => {
      setLoading(true);
      setError(null);
      setNetworkUrl(null);

      const iconsToResolve = [getIconUrl(ledgerId)];
      if (network) iconsToResolve.push(getIconUrl(network));

      try {
        const [url, networkUrlResolved] = await Promise.all(iconsToResolve);
        if (cancelled) return;

        const result: CachedResult = {
          iconUrl: url,
          networkUrl: network && networkUrlResolved ? networkUrlResolved : null,
        };

        // Cache the result
        iconCache.set(cacheKey, result);

        setIconUrl(result.iconUrl);
        if (result.networkUrl) setNetworkUrl(result.networkUrl);
      } catch (e) {
        if (cancelled) return;

        const errorInstance = e instanceof Error ? e : new Error('Failed to load icon');
        setError(errorInstance);
        console.error('Failed to load crypto icon:', errorInstance);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      cancelled = true;
    };
  }, [ledgerId, network, cacheKey]);

  return {
    iconUrl,
    networkUrl,
    loading,
    error,
  };
};
