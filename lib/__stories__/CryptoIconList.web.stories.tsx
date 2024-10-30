import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon';

const meta = {
  title: 'CryptoIconListWeb',
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

const ICONS = Object.entries(iconsObj);

const getNetworkFormLedgerId = (ledgerId: string) => {
  const ledgerIdSplit = ledgerId.split('/');
  return ledgerIdSplit.length > 1 ? ledgerIdSplit[0] : undefined;
};

const Template: StoryFn = ({ theme = 'light' }) => {
  const [iconList, setIconList] = React.useState(ICONS);
  return (
    <div style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F' }}>
      <input
        style={{
          margin: '40px',
          width: '-webkit-fill-available',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid #000',
        }}
        type="search"
        placeholder="Search by ledger ID"
        onChange={(event) => setIconList(ICONS.filter(([key]) => key.includes(event.target.value)))}
      />
      <div
        style={{
          padding: '0.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          margin: '0px 40px',
        }}
      >
        {iconList.map(([key, value]) => (
          <div key={key}>
            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
                title={key}
              >
                <CryptoIcon
                  ledgerId={key}
                  ticker={value.icon}
                  size="56px"
                  theme={theme}
                  network={getNetworkFormLedgerId(key)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AllLedgerIcons: StoryFn = Template.bind({});
