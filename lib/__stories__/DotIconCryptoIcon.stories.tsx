import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DotIcon } from '@ledgerhq/lumen-ui-react';
import { Check, Clock, Close } from '@ledgerhq/lumen-ui-react/symbols';
import CryptoIcon from '../src/components/CryptoIcon';

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
    size: 20,
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
<DotIcon icon={Check} appearance="success" size={20}>
  <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
</DotIcon>`,
      },
    },
  },
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      {[
        { icon: Check, appearance: 'success' as const, label: 'success' },
        { icon: Clock, appearance: 'muted' as const, label: 'muted' },
        { icon: Close, appearance: 'error' as const, label: 'error' },
      ].map(({ icon, appearance, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <DotIcon icon={icon} appearance={appearance} size={20}>
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const PinShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((pin) => (
        <div key={pin} className="flex flex-col items-center gap-2">
          <DotIcon icon={Check} appearance="success" size={20} pin={pin}>
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <span style={{ fontSize: 11, color: '#888' }}>{pin}</span>
        </div>
      ))}
    </div>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-end">
      {([16, 20, 24] as const).map((dotSize) => (
        <div key={dotSize} className="flex flex-col items-center gap-2">
          <DotIcon icon={Check} appearance="success" size={dotSize}>
            <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
          </DotIcon>
          <span style={{ fontSize: 11, color: '#888' }}>dot {dotSize}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    icon: Check,
    appearance: 'success',
    pin: 'bottom-end',
    size: 20,
    shape: 'circle',
  },
  render: (args) => (
    <DotIcon {...args}>
      <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={56} />
    </DotIcon>
  ),
};
