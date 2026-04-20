const ASSETS_URL =
  'https://dada.api.ledger.com/v1/assets?pageSize=100&sortOrder=desc&sortKey=marketCap';
const INDEX_URL = 'https://crypto-icons.ledger.com/index.json';

async function main() {
  const [assetsRes, indexRes] = await Promise.all([fetch(ASSETS_URL), fetch(INDEX_URL)]);

  if (!assetsRes.ok) throw new Error(`Assets API: ${assetsRes.status}`);
  if (!indexRes.ok) throw new Error(`index.json: ${indexRes.status}`);

  const assets = await assetsRes.json();
  const index = await indexRes.json();

  const rankedIds = assets.currenciesOrder?.currenciesIds ?? [];
  const mappedIds = new Set(Object.keys(index));

  const missing = rankedIds.filter((id) => !mappedIds.has(id));
  const covered = rankedIds.length - missing.length;

  // Build a ledgerId → { name, ticker } lookup from the assets response
  const idToInfo = {};
  for (const asset of Object.values(assets.cryptoAssets ?? {})) {
    for (const ledgerId of Object.values(asset.assetsIds ?? {})) {
      idToInfo[ledgerId] = { name: asset.name ?? 'N/A', ticker: asset.ticker ?? 'N/A' };
    }
  }

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
