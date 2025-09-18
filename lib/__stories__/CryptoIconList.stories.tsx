import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import iconsObj from '../../assets/index.json';
import CryptoIcon from '../src/components/CryptoIcon';
import type { CryptoIconProps } from '../src/components/CryptoIcon/CryptoIcon.types';
import type { AssertExhaustive } from '../src/helpers.types';
import { Theme, dedupeByIcon, getNetworkFormLedgerId } from './common';
import { styles, themedStyles } from './style';

const meta = {
  title: 'CryptoIconList',
  component: CryptoIcon,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['dark', 'light'],
      table: {
        type: { summary: 'radio' },
        defaultValue: { summary: 'light' },
      },
    },
  },
} satisfies Meta<typeof CryptoIcon>;

export default meta;

const ICONS = Object.entries(iconsObj);

const Template: StoryFn<typeof CryptoIcon> = ({ theme = 'light' as Theme }) => {
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
    </div>
  );
};

const NoNetworkTemplate: StoryFn<typeof CryptoIcon> = ({ theme = 'light' as Theme }) => {
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
        onChange={(event) => setSearch(event.target.value)}
      />
      <div style={styles.pageMargin}>
        <div style={styles.iconGrid}>
          {iconList.map(([key, value]) => (
            <div key={key}>
              <div style={styles.iconCard}>
                <div style={styles.iconRow} title={key}>
                  <CryptoIcon ledgerId={key} ticker={value.icon} size="56px" theme={theme} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderedTemplate: StoryFn<typeof CryptoIcon> = ({ theme = 'light' as Theme }) => {
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
  const theme = (args.theme as Theme) ?? 'light';
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
            {`<CryptoIcon ledgerId="${args.ledgerId}" ticker="${args.ticker}" size="${args.size}" theme="${args.theme}" ${args.network ? `network="${args.network}"` : ''} />`}
          </div>
        </div>
      </div>
    </div>
  );
};

const CRYPTO_ICON_SIZE_OPTIONS = [
  undefined,
  '16px',
  '20px',
  '24px',
  '32px',
  '40px',
  '48px',
  '56px',
] as const satisfies CryptoIconProps['size'][];
const _assertCryptoIconSizeOptions: AssertExhaustive<
  (typeof CRYPTO_ICON_SIZE_OPTIONS)[number],
  CryptoIconProps['size']
> = true;

export const AllLedgerIcons: StoryFn<typeof CryptoIcon> = Template.bind({});

export const AllLedgerIconsWithoutNetwork: StoryFn<typeof CryptoIcon> = NoNetworkTemplate.bind({});
AllLedgerIconsWithoutNetwork.storyName = 'All Ledger Icons (Without Network)';

export const OrderedLedgerIcons: StoryFn<typeof CryptoIcon> = OrderedTemplate.bind({});

export const SingleLedgerIcon: StoryFn<typeof CryptoIcon> = SingleIcon.bind({});
SingleLedgerIcon.args = {
  ledgerId: 'bitcoin',
  ticker: 'BTC',
  size: '56px',
  theme: 'light',
  network: undefined,
};
SingleLedgerIcon.argTypes = {
  ledgerId: { control: 'text', description: 'The ledger ID of the icon to display' },
  ticker: { control: 'text', description: 'The ticker symbol of the icon' },
  size: {
    control: 'select',
    options: CRYPTO_ICON_SIZE_OPTIONS,
    description: 'The size of the icon',
    defaultValue: '56px',
  },
  theme: {
    control: 'radio',
    options: ['dark', 'light'],
    description: 'The theme of the icon',
    defaultValue: 'light',
  },
  network: { control: 'text', description: 'The network associated with the icon' },
};
