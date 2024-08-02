import { Preview } from '@storybook/react';
import React from 'react';
import { IconProvider } from '../src/providers/IconProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <IconProvider>
        <Story />
      </IconProvider>
    ),
  ],
};

export default preview;
