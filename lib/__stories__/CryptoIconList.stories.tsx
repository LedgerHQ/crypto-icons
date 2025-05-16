import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon';

const meta = {
  title: 'CryptoIconList',
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
              <h2 style={{ textTransform: 'uppercase' }}>{letter}</h2>
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
          ))}
      </div>
    </div>
  );
};

const SingleIcon: StoryFn<typeof CryptoIcon> = (args) => {
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
        <h2 style={{ color: args.theme === 'light' ? '#000' : '#FFF' }}>Crypto Icon Viewer</h2>
        <p style={{ color: args.theme === 'light' ? '#333' : '#CCC' }}>
          Customize the props below to see the changes in real-time.
        </p>
        <div style={{ margin: '20px 0' }}>
          <CryptoIcon {...args} />
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
            {`<CryptoIcon ledgerId="${args.ledgerId}" ticker="${args.ticker}"size="${args.size}" theme="${args.theme}" ${args.network ? `network="${args.network}"` : ''}/>`}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AllLedgerIcons: StoryFn = Template.bind({});
export const OrderedLedgerIcons: StoryFn = OrderedTemplate.bind({});
export const SingleLedgerIcon: StoryFn = SingleIcon.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  ticker: 'BTC',
  size: '56px',
  theme: 'light',
  network: undefined,
};
SingleLedgerIcon.argTypes = {
  ledgerId: {
    control: 'text',
    description: 'The ledger ID of the icon to display',
  },
  ticker: {
    control: 'text',
    description: 'The ticker symbol of the icon',
  },
  size: {
    control: 'text',
    description: 'The size of the icon',
    defaultValue: '56px',
  },
  theme: {
    control: 'radio',
    options: ['dark', 'light'],
    description: 'The theme of the icon',
    defaultValue: 'light',
  },
  network: {
    control: 'text',
    description: 'The network associated with the icon',
  },
};
