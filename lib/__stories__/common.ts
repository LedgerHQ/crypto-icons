export type Theme = 'light' | 'dark';

export const getNetworkFormLedgerId = (ledgerId: string) => {
  const ledgerIdSplit = ledgerId.split('/');
  return ledgerIdSplit.length > 1 ? ledgerIdSplit[0] : undefined;
};

export function dedupeByIcon<T extends [string, { icon: string }]>(entries: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const entry of entries) {
    const [, value] = entry;
    if (seen.has(value.icon)) continue;
    seen.add(value.icon);
    out.push(entry);
  }
  return out;
}
