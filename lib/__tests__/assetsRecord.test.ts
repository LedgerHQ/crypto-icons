import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

// From lib/__tests__/ we reach repo root at ../.. then assets
const ASSETS_DIR = resolve(__dirname, '../../assets');
const RECORD_PATH = resolve(ASSETS_DIR, '_record.json');

describe('assets / _record consistency', () => {
  const record: Record<string, { ids: string[] }> = JSON.parse(
    readFileSync(RECORD_PATH, 'utf-8')
  );
  const pngTickers = new Set(
    readdirSync(ASSETS_DIR)
      .filter((f) => f.endsWith('.png'))
      .map((f) => f.replace(/\.png$/, ''))
  );
  const recordTickers = new Set(Object.keys(record));

  it('every icon PNG in assets/ must have a corresponding entry in _record.json', () => {
    const missingInRecord = [...pngTickers].filter((ticker) => !recordTickers.has(ticker)).sort();
    expect(missingInRecord).toEqual([]);
  });

  it('every ticker in _record.json must have a corresponding PNG in assets/', () => {
    const missingPng = [...recordTickers].filter((ticker) => !pngTickers.has(ticker)).sort();
    expect(missingPng).toEqual([]);
  });
});
