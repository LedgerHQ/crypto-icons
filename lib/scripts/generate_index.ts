// scripts/generate_index.ts
import { existsSync, mkdirSync } from 'fs';
import jf from 'jsonfile';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

type Index = Record<string, { icon: string }>;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const ASSETS_DIR = resolve(ROOT, 'assets');
const OUT_PATH = resolve(ASSETS_DIR, 'index.json');
const RECORD_PATH = resolve(ASSETS_DIR, '_record.json');

// { "TICKER": { "ids": ["chain/path/…", ...] }, ... }
const RecordSchema = z.record(
  z
    .string()
    .min(1, 'ticker must be a non-empty string')
    .refine((s) => !/\s/.test(s), 'ticker must not contain whitespace'),
  z.object({
    ids: z
      .array(
        z
          .string()
          .min(1, 'id must be a non-empty string')
          .refine((s) => s.trim().length > 0, 'id must not be only whitespace')
      )
      .min(1, 'ids must contain at least one id'),
  })
);

if (!existsSync(ASSETS_DIR)) mkdirSync(ASSETS_DIR, { recursive: true });
if (!existsSync(RECORD_PATH)) {
  console.error(`❌ Missing record file: ${RECORD_PATH}`);
  process.exit(1);
}

// Load & validate
const raw = jf.readFileSync(RECORD_PATH);
const parsed = RecordSchema.safeParse(raw);

if (!parsed.success) {
  console.error(`❌ Invalid record shape in ${RECORD_PATH}`);
  for (const issue of parsed.error.issues) {
    const path = issue.path.length ? issue.path.join('.') : '(root)';
    console.error(`  • ${path}: ${issue.message}`);
  }
  console.error(
    '\nExpected shape:\n{\n  "TICKER": { "ids": ["chain/path/…", "…"] },\n  "ANOTHER": { "ids": ["…"] }\n}\n'
  );
  process.exit(1);
}

const record = parsed.data;

// Translate → { id: { icon: "<TICKER>.png" } }, fully stable
const out: Index = {};
for (const ticker of Object.keys(record).sort()) {
  const ids = Array.from(new Set(record[ticker].ids.map((s) => s.trim()).filter(Boolean))).sort();
  for (const id of ids) {
    out[id] = { icon: `${ticker}.png` };
  }
}

const stableKeys = Object.keys(out).sort();
const stableOut: Index = {};
for (const k of stableKeys) stableOut[k] = out[k];

jf.writeFileSync(OUT_PATH, stableOut, { spaces: 2 });
console.log(`✔ Wrote ${OUT_PATH} (${stableKeys.length} entries)`);
