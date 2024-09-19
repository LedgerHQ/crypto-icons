import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon';

const meta = {
  title: 'CryptoIcon',
  component: CryptoIcon,
  argTypes: {
    theme: {
      control: {
        type: 'radio',
      },
      options: ['dark', 'light'],
      table: {
        type: {
          summary: 'radio',
        },
        defaultValue: {
          summary: 'light',
        },
      },
    },
  },
} satisfies Meta<typeof CryptoIcon>;

export default meta;

const getNetworkFormLedgerId = (ledgerId: string) => {
  const ledgerIdSplit = ledgerId.split('/');
  return ledgerIdSplit.length > 1 ? ledgerIdSplit[0] : undefined;
};

const Template: StoryFn = ({ theme = 'light' }) => (
  <div style={{ padding: '0.5rem', backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F' }}>
    {Object.entries(iconsObj).map(([key, value]) => (
      <div key={key}>
        <p style={{ color: theme === 'light' ? '#1C1D1F' : '#FFFFFF' }}>{key}</p>
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
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              size="56px"
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              size="48px"
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              size="40px"
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              size="32px"
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              size="24px"
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
            <CryptoIcon
              ledgerId={key}
              ticker={value.icon}
              theme={theme}
              network={getNetworkFormLedgerId(key)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="56px" theme={theme} />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="48px" theme={theme} />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="40px" theme={theme} />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="32px" theme={theme} />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} size="24px" theme={theme} />
            <CryptoIcon ledgerId={'none'} ticker={value.icon} theme={theme} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AllLedgerIcons: StoryFn = Template.bind({});
