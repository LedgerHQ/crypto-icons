import React, { ReactNode } from 'react';

type MediaImageProps = {
  src?: string;
  size?: number;
  shape?: string;
  alt?: string;
};

type DotSymbolProps = {
  src: string;
  pin?: string;
  size?: number;
  children: ReactNode;
};

type SkeletonProps = {
  component?: string;
};

export const MediaImage = ({ src, alt }: MediaImageProps) =>
  src ? <img src={src} alt={alt} role="img" /> : <div role="img" />;

export const DotSymbol = ({ children, src }: DotSymbolProps) => (
  <div>
    {children}
    <img src={src} role="img" data-testid="network-badge" />
  </div>
);

export const mediaImageDotSizeMap = {
  12: 8,
  16: 8,
  20: 8,
  24: 10,
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const;

export const Skeleton = (_props: SkeletonProps) => <div data-testid="skeleton" />;

export const LumenStyleSheetProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

export const ThemeProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

type DotIconProps = {
  icon: React.ComponentType<{ size?: number; style?: unknown }>;
  appearance: 'success' | 'muted' | 'error';
  pin?: string;
  size?: number;
  shape?: string;
  children?: ReactNode;
};

export const DotIcon = ({ children, icon: Icon, appearance }: DotIconProps) => (
  <div data-testid={`dot-icon-${appearance}`}>
    {children}
    <Icon size={16} />
  </div>
);

export const mediaImageDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const;
