import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import CryptoIcon from '../src/components/CryptoIcon/CryptoIcon.native';

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
    disabled: { control: 'boolean' },
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
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end' }}>
      {([12, 16, 20, 24, 32, 40, 48, 56, 64] as const).map((s) => (
        <View key={s} style={{ alignItems: 'center', gap: 2 }}>
          <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={s} />
          <Text style={{ fontSize: 10, color: '#888' }}>{s}</Text>
        </View>
      ))}
    </View>
  ),
};

export const ShapeShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      {(['circle', 'square'] as const).map((shape) => (
        <View key={shape} style={{ alignItems: 'center', gap: 8 }}>
          <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} shape={shape} />
          <Text style={{ fontSize: 11, color: '#888' }}>{shape}</Text>
        </View>
      ))}
    </View>
  ),
};

export const NetworkBadgeShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
        <Text style={{ fontSize: 11, color: '#888' }}>no badge</Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon
          ledgerId="ethereum/erc20/usd__coin"
          ticker="USDC"
          network="ethereum"
          size={56}
        />
        <Text style={{ fontSize: 11, color: '#888' }}>with badge</Text>
      </View>
    </View>
  ),
};

export const PinShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((pin) => (
        <View key={pin} style={{ alignItems: 'center', gap: 8 }}>
          <CryptoIcon
            ledgerId="ethereum/erc20/usd__coin"
            ticker="USDC"
            network="ethereum"
            badgePosition={pin}
            size={56}
          />
          <Text style={{ fontSize: 11, color: '#888' }}>{pin}</Text>
        </View>
      ))}
    </View>
  ),
};

export const DisabledShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
        <Text style={{ fontSize: 11, color: '#888' }}>enabled</Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} disabled />
        <Text style={{ fontSize: 11, color: '#888' }}>disabled</Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon
          ledgerId="ethereum/erc20/usd__coin"
          ticker="USDC"
          network="ethereum"
          size={56}
          disabled
        />
        <Text style={{ fontSize: 11, color: '#888' }}>disabled + badge</Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={56} disabled />
        <Text style={{ fontSize: 11, color: '#888' }}>disabled fallback</Text>
      </View>
    </View>
  ),
};

export const FallbackShowcase: Story = {
  render: () => (
    <View style={{ gap: 32 }}>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end' }}>
        {([12, 16, 20, 24, 32, 40, 48, 56, 64] as const).map((s) => (
          <View key={s} style={{ alignItems: 'center', gap: 8 }}>
            <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={s} />
            <Text style={{ fontSize: 10, color: '#888' }}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={56} shape="circle" />
          <Text style={{ fontSize: 11, color: '#888' }}>circle</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" size={56} shape="square" />
          <Text style={{ fontSize: 11, color: '#888' }}>square</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <CryptoIcon ledgerId="not_a_real_coin" ticker="BTC" network="ethereum" size={56} />
          <Text style={{ fontSize: 11, color: '#888' }}>+ badge</Text>
        </View>
      </View>
    </View>
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
    disabled: false,
  },
};
