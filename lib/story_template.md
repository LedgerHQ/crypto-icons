# Storybook Story Template

Pattern extracted from the Lumen design system:
[Button.mdx](https://github.com/LedgerHQ/lumen/blob/main/libs/ui-react/src/lib/Components/Button/Button.mdx) ·
[Button.stories.tsx](https://github.com/LedgerHQ/lumen/blob/main/libs/ui-react/src/lib/Components/Button/Button.stories.tsx)

Each component has **two files**:
- `ComponentName.mdx` — the docs page (narrative, Anatomy, Properties, Usage)
- `ComponentName.stories.tsx` — story implementations only (no prose)

---

## ComponentName.stories.tsx

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../src/components/ComponentName';
// Icon imports if needed
import { Check, Clock } from '@ledgerhq/lumen-ui-react/symbols';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'Category/ComponentName',  // e.g. 'Communication/CryptoIcon'
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    // Only props that need a custom control.
    // Icon props: use options + mapping so control shows name not [Function].
    icon: {
      control: 'select',
      options: ['None', 'Check', 'Clock'],
      mapping: { None: undefined, Check, Clock },
    },
    appearance: {
      control: 'select',
      options: ['success', 'muted', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ─── Base ──────────────────────────────────────────────────────────────────
// Minimal working example. Referenced in MDX for the Controls panel.

export const Base: Story = {
  args: {
    ledgerId: 'bitcoin',
    ticker: 'BTC',
    size: 56,
  },
  parameters: {
    docs: {
      source: {
        code: `<ComponentName ledgerId="bitcoin" ticker="BTC" size={56} />`,
      },
    },
  },
};

// ─── Showcases ─────────────────────────────────────────────────────────────
// One story per visual dimension. No args needed — render is self-contained.
// Use Tailwind classes for layout (flex, gap-*, items-center, items-end).

export const AppearanceShowcase: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <ComponentName appearance="success" />
      <ComponentName appearance="muted" />
      <ComponentName appearance="error" />
    </div>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      {([12, 16, 20, 24, 32, 40, 48, 56] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <ComponentName size={s} />
          <span style={{ fontSize: 10, color: '#888' }}>{s}</span>
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
          <ComponentName pin={pin} />
          <span style={{ fontSize: 11, color: '#888' }}>{pin}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Playground ────────────────────────────────────────────────────────────
// Full controls. Always the last export.

export const Playground: Story = {
  args: {
    ledgerId: 'bitcoin',
    ticker: 'BTC',
    size: 56,
    shape: 'circle',
  },
};
```

---

## ComponentName.mdx

```mdx
import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './ComponentName.stories';

<Meta title="Category/ComponentName" of={ComponentStories} />

# 🔷 ComponentName

## Introduction

One paragraph describing what the component does and when to use it.

## Anatomy

<Canvas of={ComponentStories.Base} />

- **Prop A (required)**: what it does
- **Prop B (optional)**: what it does

## Properties

### Overview

<Canvas of={ComponentStories.Base} />
<Controls of={ComponentStories.Base} />

### Appearance

Description of the appearance variants.

<Canvas of={ComponentStories.AppearanceShowcase} />

### Size

Description of the size variants.

<Canvas of={ComponentStories.SizeShowcase} />

### Pin

Description of the pin positions (if applicable).

<Canvas of={ComponentStories.PinShowcase} />

## Implementation

\`\`\`bash
npm install @ledgerhq/crypto-icons
\`\`\`

### Basic Usage

\`\`\`tsx
import { ComponentName } from '@ledgerhq/crypto-icons';

<ComponentName ledgerId="bitcoin" ticker="BTC" size={56} />
\`\`\`

### With optional prop

\`\`\`tsx
<ComponentName
  ledgerId="bitcoin"
  ticker="BTC"
  size={56}
  network="ethereum"
/>
\`\`\`
```

---

## Key conventions

| Rule | Detail |
|---|---|
| Two files per component | `.mdx` for prose, `.stories.tsx` for code |
| Base story | Minimal args, always has `parameters.docs.source.code` |
| Showcase stories | `render()` only, no args, Tailwind layout |
| Playground | Last export, all controllable props in `args` |
| Icon argTypes | `options: ['None', 'Check']` + `mapping: { None: undefined, Check }` |
| Layout in renders | Tailwind classes: `flex gap-{n} items-center / items-end` |
| Labels | `<span style={{ fontSize: 11, color: '#888' }}>` |
| Title prefix | `'Communication/'`, `'Action/'`, `'Input/'` |
| `layout: 'centered'` | Required — makes the docs Canvas iframe fit the content height instead of using a fixed large height |

### Tailwind spacing (Lumen 1:1 pixel scale)

| Class | Pixels |
|---|---|
| `gap-2` | 2px |
| `gap-4` | 4px |
| `gap-8` | 8px |
| `gap-16` | 16px |
| `gap-24` | 24px |
| `gap-32` | 32px |
| `gap-48` | 48px |

### React Native

Replace `div`/`span` with `View`/`Text` from `react-native`.
Replace Tailwind classes with inline `style={{ flexDirection: 'row', gap: 32 }}`.
