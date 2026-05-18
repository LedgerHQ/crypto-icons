const ASSETS_URL =
  'https://dada.api.ledger.com/v1/assets?pageSize=100&sortOrder=desc&sortKey=marketCap';
const INDEX_URL = 'https://crypto-icons.ledger.com/index.json';

async function main() {
  const [assetsRes, indexRes] = await Promise.all([fetch(ASSETS_URL), fetch(INDEX_URL)]);

  if (!assetsRes.ok) throw new Error(`Assets API: ${assetsRes.status}`);
  if (!indexRes.ok) throw new Error(`index.json: ${indexRes.status}`);

  const assets = await assetsRes.json();
  const index = await indexRes.json();

  const cryptoAssets = assets.cryptoAssets ?? {};
  const metaCurrencyIds = assets.currenciesOrder?.metaCurrencyIds ?? [];

  // Build a ledgerId → { name, ticker } lookup, and expand the ranked
  // meta-currency list into its underlying ledger IDs (preserving rank order).
  const idToInfo = {};
  const rankedIds = [];
  const seen = new Set();
  for (const metaId of metaCurrencyIds) {
    const asset = cryptoAssets[metaId];
    if (!asset) continue;
    for (const ledgerId of Object.values(asset.assetsIds ?? {})) {
      idToInfo[ledgerId] = { name: asset.name ?? 'N/A', ticker: asset.ticker ?? 'N/A' };
      if (!seen.has(ledgerId)) {
        seen.add(ledgerId);
        rankedIds.push(ledgerId);
      }
    }
  }

  const mappedIds = new Set(Object.keys(index));
  const missing = rankedIds.filter((id) => !mappedIds.has(id));
  const covered = rankedIds.length - missing.length;

  const date = new Date().toISOString().split('T')[0];
  const rows = missing.map((id) => {
    const { name, ticker } = idToInfo[id] ?? { name: 'N/A', ticker: 'N/A' };
    return `| ${ticker} | ${name} | \`${id}\` |`;
  });

  const body = [
    `## Icon Coverage Report`,
    ``,
    `> Last updated: **${date}** — [assets API](${ASSETS_URL}) vs [\`index.json\`](${INDEX_URL})`,
    ``,
    `**${covered} / ${rankedIds.length}** ranked ledger IDs are covered in \`index.json\`.`,
    ``,
    `### ❌ Missing (${missing.length})`,
    ``,
    `| Ticker | Name | Ledger ID |`,
    `| ------ | ---- | --------- |`,
    ...rows,
  ].join('\n');

  process.stdout.write(body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
