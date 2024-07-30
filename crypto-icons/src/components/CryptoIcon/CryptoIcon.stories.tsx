import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../../../assets/index.json';
import CryptoIcon from './CryptoIcon';

const meta = {
  title: 'CryptoIcon',
  component: CryptoIcon,
} satisfies Meta<typeof CryptoIcon>;

export default meta;

const Template: StoryFn = () => (
  <div>
    <h3>Ledger icon | Fallback | LedgerId</h3>
    {Object.entries(iconsObj).map(([key, value]) => (
      <div
        key={key}
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <CryptoIcon ledgerId={key} ticker={value.icon} />
        <CryptoIcon ledgerId={'none'} ticker={value.icon} />
        <p>{key}</p>
      </div>
    ))}
  </div>
);

export const AllIcons: StoryFn = Template.bind({});
