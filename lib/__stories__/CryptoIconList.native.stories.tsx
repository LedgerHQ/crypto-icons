import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon/CryptoIcon.native';

const meta = {
  title: 'CryptoIconListNative',
  component: CryptoIcon,
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['16px', '24px', '32px', '40px', '56px', '64px'],
      table: {
        type: {
          summary: 'radio',
        },
        defaultValue: {
          summary: '56px',
        },
      },
    },
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

const Template: StoryFn = ({ theme = 'light', size = '56px' }) => {
  const [iconList, setIconList] = React.useState(ICONS);
  return (
    <View style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F' }}>
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
        <View style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          flexDirection: 'row',
          margin: 40,
          padding: 10,

        }}>
        {iconList.map(([key, value]) => (
          <View key={key}>
            <View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                <CryptoIcon
                  ledgerId={key}
                  ticker={value.icon}
                  size={size}
                  theme={theme}
                  network={getNetworkFormLedgerId(key)}
                />
              </View>
            </View>
          </View>
        ))}
        </View>
    </View>
  );
};

export const AllLedgerIcons: StoryFn = Template.bind({});
