import { Meta, StoryFn } from '@storybook/react';
import { useMemo, useState } from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIconNative from '../src/components/CryptoIcon/CryptoIcon.native';
import type { CryptoIconNativeProps } from '../src/components/CryptoIcon/CryptoIcon.types';
import {
  Theme,
  dedupeByIcon,
  filterIconsByQuery,
  getNetworkFormLedgerId,
  groupByTickerInitial,
} from './common';
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
    theme: {
      control: { type: 'radio' },
      options: ['dark', 'light'],
      description: 'Icon theme',
      table: {
        type: { summary: 'radio' },
        defaultValue: { summary: 'light' },
      },
    },
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

const AllIconsTemplate: StoryFn<CryptoIconNativeProps & { showLabels?: boolean }> = ({
  theme = 'light' as Theme,
  showLabels = false,
}) => {
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
                    <CryptoIconNative
                      ledgerId={key}
                      ticker={value.icon}
                      size={56}
                      theme={theme}
                      network={network}
                    />
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

const NoNetworkTemplate: StoryFn<CryptoIconNativeProps & { showLabels?: boolean }> = ({
  theme = 'light' as Theme,
  showLabels = false,
}) => {
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

const OrderedTemplate: StoryFn<CryptoIconNativeProps & { showLabels?: boolean }> = ({
  theme = 'light' as Theme,
  showLabels = false,
}) => {
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
          ))}
      </div>
    </div>
  );
};

const SingleIconTemplate: StoryFn<CryptoIconNativeProps> = (args) => {
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

export const AllLedgerIcons = AllIconsTemplate.bind({});
AllLedgerIcons.args = { theme: 'light', showLabels: false };

export const AllLedgerIconsWithoutNetwork = NoNetworkTemplate.bind({});
AllLedgerIconsWithoutNetwork.storyName = 'All Ledger Icons (Without Network)';
AllLedgerIconsWithoutNetwork.args = { theme: 'light', showLabels: false };

export const OrderedLedgerIcons = OrderedTemplate.bind({});
OrderedLedgerIcons.args = { theme: 'light', showLabels: false };

export const SingleLedgerIcon: StoryFn<typeof CryptoIconNative> = SingleIconTemplate.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  ticker: 'BTC',
  size: 56,
  theme: 'light',
  network: undefined,
};
SingleLedgerIcon.argTypes = {
  ledgerId: { control: { type: 'text' }, description: 'Ledger ID of the cryptocurrency' },
  ticker: { control: { type: 'text' }, description: 'Ticker symbol of the cryptocurrency' },
  size: {
    control: { type: 'select' },
    options: [16, 20, 24, 32, 40, 48, 56],
    description: 'Icon size in pixels',
  },
  theme: { control: { type: 'radio' }, options: ['dark', 'light'], description: 'Icon theme' },
  network: { control: { type: 'text' }, description: 'Cryptocurrency network (optional)' },
};
