import { Meta, StoryObj } from '@storybook/react';
import FallbackIcon from './FallbackIcon';

const meta = {
  title: 'FallbackIcon',
  component: FallbackIcon,
} satisfies Meta<typeof FallbackIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleBTC: Story = {
  args: {
    ticker: 'BTC',
  },
};

export const ExampleETH: Story = {
  args: {
    ticker: 'ETH',
  },
};

export const ExampleSOL: Story = {
  args: {
    ticker: 'SOL',
  },
};
