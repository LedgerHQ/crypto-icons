import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CryptoIcon from '../src/components/CryptoIcon';

const meta: Meta<typeof CryptoIcon> = {
  component: CryptoIcon,
  title: 'Communication/CryptoIcon',
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    ledgerId: { control: 'text' },
    ticker: { control: 'text' },
    network: { control: 'text' },
    badgePosition: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    size: {
      control: 'select',
      options: [12, 16, 20, 24, 32, 40, 48, 56, 64],
    },
    shape: {
      control: 'radio',
      options: ['circle', 'square'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CryptoIcon>;

export const Base: Story = {
  args: {
    ledgerId: 'bitcoin',
    ticker: 'BTC',
    size: 56,
  },
  parameters: {
    docs: {
      source: {
        code: `<CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      {([12, 16, 20, 24, 32, 40, 48, 56, 64] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={s} />
          <span style={{ fontSize: 10, color: '#888' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const ShapeShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      {(['circle', 'square'] as const).map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} shape={shape} />
          <span style={{ fontSize: 11, color: '#888' }}>{shape}</span>
        </div>
      ))}
    </div>
  ),
};

export const NetworkBadgeShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col items-center gap-2">
        <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
        <span style={{ fontSize: 11, color: '#888' }}>no badge</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CryptoIcon
          ledgerId="ethereum/erc20/usd__coin"
          ticker="USDC"
          network="ethereum"
          size={56}
        />
        <span style={{ fontSize: 11, color: '#888' }}>with badge</span>
      </div>
    </div>
  ),
};

export const PinShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((pin) => (
        <div key={pin} className="flex flex-col items-center gap-2">
          <CryptoIcon
            ledgerId="ethereum/erc20/usd__coin"
            ticker="USDC"
            network="ethereum"
            badgePosition={pin}
            size={56}
          />
          <span style={{ fontSize: 11, color: '#888' }}>{pin}</span>
        </div>
      ))}
    </div>
  ),
};

export const FallbackShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-end">
        {([12, 16, 20, 24, 32, 40, 48, 56, 64] as const).map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={s} />
            <span style={{ fontSize: 10, color: '#888' }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center gap-2">
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={56} shape="circle" />
          <span style={{ fontSize: 11, color: '#888' }}>circle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={56} shape="square" />
          <span style={{ fontSize: 11, color: '#888' }}>square</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" network="ethereum" size={56} />
          <span style={{ fontSize: 11, color: '#888' }}>+ badge</span>
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    ledgerId: 'bitcoin',
    ticker: 'BTC',
    network: undefined,
    badgePosition: 'bottom-end',
    size: 56,
    shape: 'circle',
  },
};
