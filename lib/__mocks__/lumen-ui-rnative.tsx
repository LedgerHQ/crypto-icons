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
