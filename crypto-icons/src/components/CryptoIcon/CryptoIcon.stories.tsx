import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import CryptoIcon from './CryptoIcon';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const json = require('../../../../assets/index.json');

const meta = {
  title: 'CryptoIcon',
  component: CryptoIcon,
} satisfies Meta<typeof CryptoIcon>;

export default meta;

const Template: StoryFn = () => (
  <div>
    {Object.keys(json).map((key) => (
      <div
        key={key}
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <CryptoIcon ledgerId={key} ticker="abc" />
        <p>{key}</p>
      </div>
    ))}
  </div>
);

export const AllLedgerIcons: StoryFn = Template.bind({});
