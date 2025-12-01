// stories/common.ts
export type Theme = 'light' | 'dark';

export type IconsIndex = Record<string, { icon: string }>;
export type IconEntry = [ledgerId: string, value: { icon: string }];

const lower = (s: string) => s.toLowerCase();

/** Parse a network prefix from a ledgerId like "ethereum/erc20/usdc". */
export function getNetworkFormLedgerId(ledgerId: string): string | undefined {
  const parts = ledgerId.split('/');
  return parts.length > 1 ? parts[0] : undefined;
}

export function getNetworkFromLedgerId(ledgerId: string): string | undefined {
  // network is the first segment before the first "/"
  const seg = ledgerId.split('/')[0]?.trim();
  return seg || undefined;
}

function tokenizeLedgerId(ledgerId: string): string[] {
  // segments from "/" AND "_" to broaden partial matching
  const slashParts = ledgerId.split('/').filter(Boolean);
  const parts: string[] = [];
  for (const p of slashParts) {
    parts.push(p);
    for (const sub of p.split('_')) {
      if (sub && sub !== p) parts.push(sub);
    }
  }
  // dedupe while preserving order
  const seen = new Set<string>();
  return parts.filter((p) => {
    const k = p.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function filterIconsByQuery(entries: IconEntry[], rawQuery: string): IconEntry[] {
  const q = (rawQuery || '').trim().toLowerCase();
  if (!q) return entries;

  const words = q.split(/\s+/).filter(Boolean);

  // Identify an optional "network" word (equals the first segment of ledgerId)
  // We'll treat the first word that is one of the known networks (present in data) as the filter.
  // (Heuristic: derive known networks from the dataset.)
  const knownNetworks = new Set(
    entries.map(([id]) => getNetworkFromLedgerId(id)?.toLowerCase()).filter((n): n is string => !!n)
  );

  let networkFilter: string | undefined;
  const nonNetworkWords: string[] = [];
  for (const w of words) {
    if (!networkFilter && knownNetworks.has(w)) {
      networkFilter = w;
    } else {
      nonNetworkWords.push(w);
    }
  }

  // Only apply network filter if there are other search terms present
  if (networkFilter && nonNetworkWords.length === 0) {
    networkFilter = undefined;
    nonNetworkWords.push(...words); // treat all words as search terms
  }

  return entries.filter(([ledgerId, { icon }]) => {
    const net = getNetworkFromLedgerId(ledgerId)?.toLowerCase();
    if (networkFilter && net !== networkFilter) return false;

    // Fields to match against (partial, case-insensitive)
    const hayLedger = ledgerId.toLowerCase();
    const hayTicker = (icon || '').toLowerCase();
    const haySegments = tokenizeLedgerId(ledgerId).map((s) => s.toLowerCase());

    // AND over all non-network words
    for (const w of nonNetworkWords) {
      const match =
        hayLedger.includes(w) ||
        hayTicker.includes(w) ||
        haySegments.some((seg) => seg.includes(w));

      if (!match) return false; // this word didn't match any field → exclude
    }

    return true;
  });
}

/** Keep the first occurrence of each ticker (used by "no network" views). */
export function dedupeByIcon(entries: IconEntry[]): IconEntry[] {
  const seen = new Set<string>();
  const out: IconEntry[] = [];
  for (const e of entries) {
    const ticker = e[1]?.icon ?? '';
    if (seen.has(ticker)) continue;
    seen.add(ticker);
    out.push(e);
  }
  return out;
}

/** Search by ledgerId OR ticker (case-insensitive). */
export function searchIcons(entries: IconEntry[], query: string): IconEntry[] {
  const q = query.trim();
  if (!q) return entries;
  const ql = lower(q);
  return entries.filter(
    ([ledgerId, { icon }]) => lower(ledgerId).includes(ql) || lower(icon).includes(ql)
  );
}

/** Group by first letter of the ticker (A-Z, falls back to '#'). */
export function groupByTickerInitial(entries: IconEntry[]): Record<string, IconEntry[]> {
  const acc: Record<string, IconEntry[]> = {};
  for (const entry of entries) {
    const ticker = entry[1]?.icon ?? '';
    const letter = (ticker[0] ?? '#').toUpperCase();
    (acc[letter] ??= []).push(entry);
  }
  return acc;
}
