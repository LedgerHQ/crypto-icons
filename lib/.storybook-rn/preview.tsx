import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import type { Decorator } from '@storybook/react';
import React from 'react';
import '../src/styles.css';

const BG: Record<string, string> = {
  light: '#ffffff',
  dark: '#131214',
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', icon: 'sun', title: 'Light' },
        { value: 'dark', icon: 'moon', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
};

export const parameters = {
  backgrounds: { disable: true },
};

export const decorators: Decorator[] = [
  (Story, context) => {
    const colorScheme = (context.globals.theme ?? 'light') as 'light' | 'dark';
    return (
      <ThemeProvider themes={ledgerLiveThemes} colorScheme={colorScheme}>
        <div style={{ backgroundColor: BG[colorScheme], padding: 16 }}>
          <Story />
        </div>
      </ThemeProvider>
    );
  },
];
