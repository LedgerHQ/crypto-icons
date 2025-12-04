import { useEffect, useState } from 'react';
import { getIconUrl } from '../iconMapping';

interface UseCryptoIconProps {
  ledgerId: string;
  network?: string;
}

type IconState =
  | { status: 'loading' }
  | { status: 'success'; iconUrl: string | null; networkUrl: string | null }
  | { status: 'error'; error: Error };

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

  const [iconState, setIconState] = useState<IconState>(() => {
    if (cached) {
      return {
        status: 'success',
        iconUrl: cached.iconUrl,
        networkUrl: cached.networkUrl,
      };
    }
    return { status: 'loading' };
  });

  useEffect(() => {
    // Recalculate cacheKey inside effect (it's a derived value from ledgerId and network)
    const effectCacheKey = getCacheKey(ledgerId, network);

    // Check cache again inside effect (in case it was populated by another instance)
    const cachedResult = iconCache.get(effectCacheKey);
    if (cachedResult) {
      setIconState({
        status: 'success',
        iconUrl: cachedResult.iconUrl,
        networkUrl: cachedResult.networkUrl,
      });
      return;
    }

    let cancelled = false;

    const loadIcon = async () => {
      setIconState({ status: 'loading' });

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
        iconCache.set(effectCacheKey, result);

        setIconState({
          status: 'success',
          iconUrl: result.iconUrl,
          networkUrl: result.networkUrl,
        });
      } catch (e) {
        if (cancelled) return;

        const errorInstance = e instanceof Error ? e : new Error('Failed to load icon');
        console.error('Failed to load crypto icon:', errorInstance);
        setIconState({
          status: 'error',
          error: errorInstance,
        });
      }
    };

    loadIcon();

    return () => {
      cancelled = true;
    };
  }, [ledgerId, network]);

  if (iconState.status === 'loading') {
    return {
      iconUrl: null,
      networkUrl: null,
      loading: true,
      error: null,
    };
  }
  if (iconState.status === 'error') {
    return {
      iconUrl: null,
      networkUrl: null,
      loading: false,
      error: iconState.error,
    };
  }
  return {
    iconUrl: iconState.iconUrl,
    networkUrl: iconState.networkUrl,
    loading: false,
    error: null,
  };
};
