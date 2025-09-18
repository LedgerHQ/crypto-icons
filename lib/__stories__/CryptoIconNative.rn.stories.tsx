import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIconNative from '../src/components/CryptoIcon/CryptoIcon.native';
import { Theme, dedupeByIcon, getNetworkFormLedgerId } from './common';
import { styles, themedStyles } from './style';

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
    ledgerId: { control: { type: 'text' }, description: 'Ledger ID of the cryptocurrency' },
    ticker: { control: { type: 'text' }, description: 'Ticker symbol of the cryptocurrency' },
    size: {
      control: { type: 'select' },
      options: [16, 20, 24, 32, 40, 48, 56],
      description: 'Icon size in pixels',
    },
    theme: { control: { type: 'radio' }, options: ['dark', 'light'], description: 'Icon theme' },
    network: { control: { type: 'text' }, description: 'Cryptocurrency network (optional)' },
  },
} satisfies Meta<typeof CryptoIconNative>;

export default meta;

const ICONS = Object.entries(iconsObj);

const AllIconsTemplate: StoryFn<typeof CryptoIconNative> = ({ theme = 'light' as Theme }) => {
  const [iconList, setIconList] = React.useState(ICONS);

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID"
        onChange={(event) => setIconList(ICONS.filter(([key]) => key.includes(event.target.value)))}
      />
      <div style={styles.pageMargin}>
        <div style={styles.iconGrid}>
          {iconList.map(([key, value]) => (
            <div key={key}>
              <div style={styles.iconCard}>
                <div style={styles.iconRow} title={key}>
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
    </div>
  );
};

const NoNetworkTemplate: StoryFn<typeof CryptoIconNative> = ({ theme = 'light' as Theme }) => {
  const [search, setSearch] = React.useState('');

  const iconList = React.useMemo(() => {
    return dedupeByIcon(
      ICONS.filter(([key]) => key.includes(search)).filter(([key]) =>
        Boolean(getNetworkFormLedgerId(key))
      )
    );
  }, [search]);

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={styles.pageMargin}>
        <div style={styles.iconGrid}>
          {iconList.map(([key, value]) => (
            <div key={key}>
              <div style={styles.iconCard}>
                <div style={styles.iconRow} title={key}>
                  <CryptoIconNative ledgerId={key} ticker={value.icon} size={56} theme={theme} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderedTemplate: StoryFn<typeof CryptoIconNative> = ({ theme = 'light' as Theme }) => {
  const [iconList, setIconList] = React.useState(ICONS);

  const groupedIcons = React.useMemo(() => {
    return iconList.reduce(
      (acc, [key, value]) => {
        const firstLetter = value.icon[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push([key, value]);
        return acc;
      },
      {} as Record<string, typeof ICONS>
    );
  }, [iconList]);

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID"
        onChange={(event) => setIconList(ICONS.filter(([key]) => key.includes(event.target.value)))}
      />
      <div style={styles.pageMargin}>
        {Object.keys(groupedIcons)
          .sort()
          .map((letter) => (
            <div key={letter} style={styles.alphaGroup}>
              <h2 style={{ ...styles.alphaHeader, ...themedStyles.headingColor(theme) }}>
                {letter}
              </h2>
              <div style={styles.iconGrid}>
                {groupedIcons[letter].map(([key, value]) => (
                  <div key={key}>
                    <div style={styles.iconCard}>
                      <div style={styles.iconRow} title={key}>
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

const SingleIconTemplate: StoryFn<typeof CryptoIconNative> = (args) => {
  const theme = (args.theme as Theme) ?? 'light';
  return (
    <div style={styles.viewportCenter}>
      <div style={themedStyles.panel(theme)}>
        <h2 style={themedStyles.headingColor(theme)}>React Native Crypto Icon</h2>
        <p style={themedStyles.subtext(theme)}>
          Customize the props below to see the changes in real-time.
        </p>
        <div style={styles.iconPreview}>
          <CryptoIconNative {...args} />
        </div>
        <div style={themedStyles.detailsText(theme)}>
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
          <div style={styles.codeBlock}>
            {`<CryptoIconNative ledgerId="${args.ledgerId}" ticker="${args.ticker}" size={${args.size}} theme="${args.theme}" ${args.network ? `network="${args.network}"` : ''} />`}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AllLedgerIcons: StoryFn<typeof CryptoIconNative> = AllIconsTemplate.bind({});
AllLedgerIcons.args = { theme: 'light' };

export const AllLedgerIconsWithoutNetwork: StoryFn<typeof CryptoIconNative> =
  NoNetworkTemplate.bind({});
AllLedgerIconsWithoutNetwork.storyName = 'All Ledger Icons (Without Network)';
AllLedgerIconsWithoutNetwork.args = { theme: 'light' };

export const OrderedLedgerIcons: StoryFn<typeof CryptoIconNative> = OrderedTemplate.bind({});
OrderedLedgerIcons.args = { theme: 'light' };

export const SingleLedgerIcon: StoryFn<typeof CryptoIconNative> = SingleIconTemplate.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  ticker: 'BTC',
  size: 56,
  theme: 'light',
  network: undefined,
};
