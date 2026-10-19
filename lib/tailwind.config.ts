import { ledgerLivePreset } from '@ledgerhq/lumen-design-core';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [ledgerLivePreset],
};

export default config;
