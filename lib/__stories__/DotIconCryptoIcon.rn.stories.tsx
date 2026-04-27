import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { DotIcon, mediaImageDotIconSizeMap } from '@ledgerhq/lumen-ui-rnative';
import { Check, Clock, Close } from '@ledgerhq/lumen-ui-rnative/symbols';
import CryptoIcon from '../src/components/CryptoIcon/CryptoIcon.native';

const meta: Meta<typeof DotIcon> = {
  component: DotIcon,
  title: 'Communication/DotCryptoIcon',
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
    appearance: {
      control: 'select',
      options: ['success', 'muted', 'error'],
    },
    pin: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    size: {
      control: 'select',
      options: [16, 20, 24],
    },
    shape: {
      control: 'radio',
      options: ['circle', 'square'],
    },
    icon: {
      control: 'select',
      options: ['Check', 'Clock', 'Close'],
      mapping: { Check, Clock, Close },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DotIcon>;

export const Base: Story = {
  args: {
    icon: Check,
    appearance: 'success',
    pin: 'bottom-end',
    size: mediaImageDotIconSizeMap[56],
  },
  render: (args) => (
    <DotIcon {...args}>
      <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
    </DotIcon>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<DotIcon icon={Check} appearance="success" size={mediaImageDotIconSizeMap[56]}>
  <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
</DotIcon>`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      {[
        { icon: Check, appearance: 'success' as const, label: 'success' },
        { icon: Clock, appearance: 'muted' as const, label: 'muted' },
        { icon: Close, appearance: 'error' as const, label: 'error' },
      ].map(({ icon, appearance, label }) => (
        <View key={label} style={{ alignItems: 'center', gap: 8 }}>
          <DotIcon icon={icon} appearance={appearance} size={mediaImageDotIconSizeMap[56]}>
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <Text style={{ fontSize: 11, color: '#888' }}>{label}</Text>
        </View>
      ))}
    </View>
  ),
};

export const PinShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((pin) => (
        <View key={pin} style={{ alignItems: 'center', gap: 8 }}>
          <DotIcon
            icon={Check}
            appearance="success"
            size={mediaImageDotIconSizeMap[56]}
            pin={pin}
          >
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <Text style={{ fontSize: 11, color: '#888' }}>{pin}</Text>
        </View>
      ))}
    </View>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-end' }}>
      {([16, 20, 24] as const).map((dotSize) => (
        <View key={dotSize} style={{ alignItems: 'center', gap: 8 }}>
          <DotIcon icon={Check} appearance="success" size={dotSize}>
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <Text style={{ fontSize: 11, color: '#888' }}>dot {dotSize}px</Text>
        </View>
      ))}
    </View>
  ),
};

export const Playground: Story = {
  args: {
    icon: Check,
    appearance: 'success',
    pin: 'bottom-end',
    size: mediaImageDotIconSizeMap[56],
    shape: 'circle',
  },
  render: (args) => (
    <DotIcon {...args}>
      <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
    </DotIcon>
  ),
};
