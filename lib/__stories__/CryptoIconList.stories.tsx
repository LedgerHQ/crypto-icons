import { Meta, StoryContext, StoryFn } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon';
import {
  Theme,
  dedupeByIcon,
  filterIconsByQuery,
  getNetworkFormLedgerId,
  groupByTickerInitial,
} from './common';
import { styles, themedStyles } from './style';

const meta = {
  title: 'CryptoIconList',
  component: CryptoIcon,
  argTypes: {
    showLabels: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      description: 'Show name, ticker, and network labels below icons',
    },
  },
} as Meta<any>;

export default meta;

const ICONS = Object.entries(iconsObj);

const Template: StoryFn<{ showLabels?: boolean }> = (
  { showLabels = false },
  { globals }: StoryContext
) => {
  const theme = (globals.theme ?? 'light') as Theme;
  const [iconList, setIconList] = useState(ICONS);

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID or ticker"
        onChange={(e) => setIconList(filterIconsByQuery(ICONS, e.target.value))}
      />
      <div style={styles.pageMargin}>
        <div style={styles.iconGrid}>
          {iconList.map(([key, value]) => {
            const network = getNetworkFormLedgerId(key);
            return (
              <div key={key}>
                <div style={styles.iconCard}>
                  <div style={styles.iconRow} title={key}>
                    <CryptoIcon ledgerId={key} ticker={value.icon} size={56} network={network} />
                  </div>
                  {showLabels && (
                    <div style={themedStyles.labelContainer()}>
                      <div style={themedStyles.labelText(theme)} title={key}>
                        {key}
                      </div>
                      <div style={themedStyles.labelText(theme)} title={value.icon}>
                        {value.icon}
                      </div>
                      {network && (
                        <div style={themedStyles.labelTextNetwork(theme)} title={network}>
                          {network}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NoNetworkTemplate: StoryFn<{ showLabels?: boolean }> = (
  { showLabels = false },
  { globals }: StoryContext
) => {
  const theme = (globals.theme ?? 'light') as Theme;
  const [search, setSearch] = useState('');

  const iconList = useMemo(
    () =>
      dedupeByIcon(
        filterIconsByQuery(ICONS, search).filter(([key]) => Boolean(getNetworkFormLedgerId(key)))
      ),
    [search]
  );

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID or ticker"
        onChange={(event) => setSearch(event.target.value)}
      />
      <div style={styles.pageMargin}>
        <div style={styles.iconGrid}>
          {iconList.map(([key, value]) => (
            <div key={key}>
              <div style={styles.iconCard}>
                <div style={styles.iconRow} title={key}>
                  <CryptoIcon ledgerId={key} ticker={value.icon} size={56} />
                </div>
                {showLabels && (
                  <div style={themedStyles.labelContainer()}>
                    <div style={themedStyles.labelText(theme)} title={key}>
                      {key}
                    </div>
                    <div style={themedStyles.labelText(theme)} title={value.icon}>
                      {value.icon}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderedTemplate: StoryFn<{ showLabels?: boolean }> = (
  { showLabels = false },
  { globals }: StoryContext
) => {
  const theme = (globals.theme ?? 'light') as Theme;
  const [iconList, setIconList] = useState(ICONS);

  const groupedIcons = useMemo(() => groupByTickerInitial(iconList), [iconList]);

  return (
    <div style={themedStyles.pageBg(theme)}>
      <input
        style={styles.searchInput}
        type="search"
        placeholder="Search by ledger ID or ticker"
        onChange={(event) => setIconList(filterIconsByQuery(ICONS, event.target.value))}
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
                {groupedIcons[letter].map(([key, value]) => {
                  const network = getNetworkFormLedgerId(key);
                  return (
                    <div key={key}>
                      <div style={styles.iconCard}>
                        <div style={styles.iconRow} title={key}>
                          <CryptoIcon ledgerId={key} ticker={value.icon} size={56} network={network} />
                        </div>
                        {showLabels && (
                          <div style={themedStyles.labelContainer()}>
                            <div style={themedStyles.labelText(theme)} title={key}>
                              {key}
                            </div>
                            <div style={themedStyles.labelText(theme)} title={value.icon}>
                              {value.icon}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const SingleIcon: StoryFn<typeof CryptoIcon> = (args, { globals }: StoryContext) => {
  const theme = (globals.theme ?? 'light') as Theme;
  return (
    <div style={styles.viewportCenter}>
      <div style={themedStyles.panel(theme)}>
        <h2 style={themedStyles.headingColor(theme)}>Crypto Icon Viewer</h2>
        <p style={themedStyles.subtext(theme)}>
          Customize the props below to see the changes in real-time.
        </p>
        <div style={styles.iconPreview}>
          <CryptoIcon {...args} />
        </div>
        <div style={themedStyles.detailsText(theme)}>
          <p>
            <strong>Ledger ID:</strong> {args.ledgerId || 'N/A'}
          </p>
          <p>
            <strong>Size:</strong> {args.size || 'N/A'}
          </p>
          <p>
            <strong>Network:</strong> {args.network || 'N/A'}
          </p>
          <div style={styles.codeBlock}>
            {`<CryptoIcon ledgerId="${args.ledgerId}" size={${args.size}}${args.network ? ` network="${args.network}"` : ''} />`}
          </div>
        </div>
      </div>
    </div>
  );
};

const SquareIconsTemplate: StoryFn<{ showLabels?: boolean }> = (
  { showLabels = false },
  { globals }: StoryContext
) => {
  const theme = (globals.theme ?? 'light') as Theme;
  const MAIN_CURRENCIES: Array<{ ledgerId: string; ticker: string }> = [
    { ledgerId: 'bitcoin', ticker: 'BTC' },
    { ledgerId: 'ethereum', ticker: 'ETH' },
    { ledgerId: 'ripple', ticker: 'XRP' },
    { ledgerId: 'cardano', ticker: 'ADA' },
    { ledgerId: 'solana', ticker: 'SOL' },
    { ledgerId: 'polkadot', ticker: 'DOT' },
    { ledgerId: 'dogecoin', ticker: 'DOGE' },
    { ledgerId: 'polygon', ticker: 'MATIC' },
    { ledgerId: 'litecoin', ticker: 'LTC' },
    { ledgerId: 'avalanche_c_chain', ticker: 'AVAX' },
    { ledgerId: 'injective', ticker: 'INJ' },
  ];

  return (
    <div style={themedStyles.pageBg(theme)}>
      <div style={styles.pageMargin}>
        <h2 style={{ ...themedStyles.headingColor(theme), marginBottom: '20px', marginTop: '40px' }}>
          Square Icons — Main Currencies
        </h2>
        <div style={styles.iconGrid}>
          {MAIN_CURRENCIES.map(({ ledgerId, ticker }) => (
            <div key={ledgerId}>
              <div style={styles.iconCard}>
                <div style={styles.iconRow} title={ledgerId}>
                  <CryptoIcon ledgerId={ledgerId} ticker={ticker} size={56} shape="square" />
                </div>
                {showLabels && (
                  <div style={themedStyles.labelContainer()}>
                    <div style={themedStyles.labelText(theme)} title={ledgerId}>
                      {ledgerId}
                    </div>
                    <div style={themedStyles.labelText(theme)} title={ticker}>
                      {ticker}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AllLedgerIcons: StoryFn<{ showLabels?: boolean }> = Template.bind({});
export const AllLedgerIconsWithoutNetwork: StoryFn<{ showLabels?: boolean }> = NoNetworkTemplate.bind({});
AllLedgerIconsWithoutNetwork.storyName = 'All Ledger Icons (Without Network)';
export const OrderedLedgerIcons: StoryFn<{ showLabels?: boolean }> = OrderedTemplate.bind({});
export const SingleLedgerIcon: StoryFn<typeof CryptoIcon> = SingleIcon.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  size: 56,
  network: undefined,
  ticker: 'BTC',
};
SingleLedgerIcon.argTypes = {
  ledgerId: { control: 'text', description: 'The ledger ID of the icon to display' },
  ticker: { control: 'text', description: 'The ticker of the icon to display' },
  size: {
    control: 'select',
    options: [12, 16, 20, 24, 32, 40, 48, 56, 64],
    description: 'The size of the icon',
    defaultValue: 56,
  },
  network: { control: 'text', description: 'The network associated with the icon' },
  badgePosition: {
    control: 'select',
    options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    description: 'Position of the network badge',
    defaultValue: 'bottom-end',
  },
};

export const SquareIcons: StoryFn<{ showLabels?: boolean }> = SquareIconsTemplate.bind({});
SquareIcons.storyName = 'Square Icons (Main Currencies)';
