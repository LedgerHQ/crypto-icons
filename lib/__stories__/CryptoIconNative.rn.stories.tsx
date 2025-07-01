import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIconNative from '../src/components/CryptoIcon/CryptoIcon.native';
import type { CryptoIconNativeProps } from '../src/components/CryptoIcon/CryptoIcon.types';

const meta = {
  title: 'CryptoIcon React Native',
  component: CryptoIconNative,
  parameters: {
    docs: {
      description: {
        component:
          'REAL React Native version of the CryptoIcon component. This story uses real React Native components rendered via react-native-web.',
      },
    },
  },
  argTypes: {
    ledgerId: {
      control: { type: 'text' },
      description: 'Ledger ID of the cryptocurrency',
    },
    ticker: {
      control: { type: 'text' },
      description: 'Ticker symbol of the cryptocurrency',
    },
    size: {
      control: { type: 'select' },
      options: [16, 20, 24, 32, 40, 48, 56],
      description: 'Icon size in pixels',
    },
    theme: {
      control: { type: 'radio' },
      options: ['dark', 'light'],
      description: 'Icon theme',
    },
    network: {
      control: { type: 'text' },
      description: 'Cryptocurrency network (optional)',
    },
  },
} satisfies Meta<typeof CryptoIconNative>;

export default meta;

const ICONS = Object.entries(iconsObj);

const getNetworkFormLedgerId = (ledgerId: string) => {
  const ledgerIdSplit = ledgerId.split('/');
  return ledgerIdSplit.length > 1 ? ledgerIdSplit[0] : undefined;
};

type Story = StoryFn<CryptoIconNativeProps>;

const AllIconsTemplate: StoryFn = ({ theme = 'light' }) => {
  const [iconList, setIconList] = React.useState(ICONS);

  return (
    <div style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F' }}>
      <input
        style={{
          margin: '40px',
          width: '-webkit-fill-available',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid #ccc',
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
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
                title={key}
              >
                <CryptoIconNative
                  ledgerId={key}
                  ticker={value.icon}
                  size={56}
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

const SingleIconTemplate: StoryFn<CryptoIconNativeProps> = (args) => {
  return (
    <div
      style={{
        height: '92vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: args.theme === 'light' ? '#FFFFFF' : '#1C1D1F',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2 style={{ color: args.theme === 'light' ? '#000' : '#FFF' }}>
          React Native Crypto Icon
        </h2>
        <p style={{ color: args.theme === 'light' ? '#333' : '#CCC' }}>
          Customize the props below to see the changes in real-time.
        </p>
        <div style={{ margin: '20px 0' }}>
          <CryptoIconNative {...args} />
        </div>
        <div style={{ color: args.theme === 'light' ? '#333' : '#CCC', fontSize: '14px' }}>
          <p>
            <strong>Ledger ID:</strong> {args.ledgerId || 'N/A'}
          </p>
          <p>
            <strong>Ticker:</strong> {args.ticker || 'N/A'}
          </p>
          <p>
            <strong>Size:</strong> {args.size || 'N/A'}
          </p>
          <p>
            <strong>Theme:</strong> {args.theme || 'N/A'}
          </p>
          <p>
            <strong>Network:</strong> {args.network || 'N/A'}
          </p>
          <div
            style={{
              backgroundColor: '#2d2d2d',
              padding: '15px 10px',
              borderRadius: '8px',
              marginTop: '20px',
              color: '#f8f8f2',
              fontFamily: 'monospace',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {`<CryptoIcon ledgerId="${args.ledgerId}" ticker="${args.ticker}" size={${args.size}} theme="${args.theme}" ${args.network ? `network="${args.network}"` : ''}/>`}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderedTemplate: StoryFn = ({ theme = 'light' }) => {
  const [iconList, setIconList] = React.useState(ICONS);

  const groupedIcons = React.useMemo(() => {
    return iconList.reduce(
      (acc, [key, value]) => {
        const firstLetter = value.icon[0].toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push([key, value]);
        return acc;
      },
      {} as Record<string, typeof ICONS>
    );
  }, [iconList]);

  return (
    <div style={{ backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F' }}>
      <input
        style={{
          margin: '40px',
          width: '-webkit-fill-available',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid #ccc',
        }}
        type="search"
        placeholder="Search by ledger ID"
        onChange={(event) => setIconList(ICONS.filter(([key]) => key.includes(event.target.value)))}
      />
      <div style={{ margin: '0px 40px' }}>
        {Object.keys(groupedIcons)
          .sort()
          .map((letter) => (
            <div key={letter} style={{ marginBottom: '20px' }}>
              <h2
                style={{ textTransform: 'uppercase', color: theme === 'light' ? '#000' : '#FFF' }}
              >
                {letter}
              </h2>
              <div
                style={{
                  padding: '0.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                {groupedIcons[letter].map(([key, value]) => (
                  <div key={key}>
                    <div style={{ marginBottom: '10px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px',
                        }}
                        title={key}
                      >
                        <CryptoIconNative
                          ledgerId={key}
                          ticker={value.icon}
                          size={56}
                          theme={theme}
                          network={getNetworkFormLedgerId(key)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const AllLedgerIcons: StoryFn = AllIconsTemplate.bind({});
AllLedgerIcons.args = {
  theme: 'light',
};

export const OrderedLedgerIcons: StoryFn = OrderedTemplate.bind({});
OrderedLedgerIcons.args = {
  theme: 'light',
};

export const SingleLedgerIcon: StoryFn = SingleIconTemplate.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  ticker: 'BTC',
  size: 56,
  theme: 'light',
  network: undefined,
};