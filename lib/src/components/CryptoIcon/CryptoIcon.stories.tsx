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
    {Object.entries(iconsObj).map(([key, value]) => (
      <div key={key}>
        <p>{key}</p>
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <CryptoIcon ledgerId={key} ticker={value.icon} size="56px" />
            <CryptoIcon ledgerId={key} ticker={value.icon} size="48px" />
            <CryptoIcon ledgerId={key} ticker={value.icon} size="40px" />
            <CryptoIcon ledgerId={key} ticker={value.icon} size="32px" />
            <CryptoIcon ledgerId={key} ticker={value.icon} size="24px" />
            <CryptoIcon ledgerId={key} ticker={value.icon} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="56px" />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="48px" />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="40px" />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="32px" />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="24px" />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AllIcons: StoryFn = Template.bind({});
