import React, { ComponentPropsWithRef, ReactNode } from 'react';

type MediaImageProps = {
  src?: string;
  size?: number;
  shape?: string;
  alt?: string;
  loading?: boolean;
  fallback?: string;
  imgLoading?: string;
} & ComponentPropsWithRef<'div'>;

type DotSymbolProps = {
  src: string;
  pin?: string;
  size?: number;
  children: ReactNode;
} & ComponentPropsWithRef<'div'>;

type SkeletonProps = {
  component?: string;
} & ComponentPropsWithRef<'div'>;

export const MediaImage = ({ src, alt, loading, fallback }: MediaImageProps) => {
  if (loading) {
    return (
      <div role="img">
        <Skeleton />
      </div>
    );
  }
  if (src) {
    return <img src={src} alt={alt} role="img" />;
  }
  return <div role="img">{fallback ? fallback[0]?.toUpperCase() : null}</div>;
};

export const DotSymbol = ({ children, src }: DotSymbolProps) => (
  <div>
    {children}
    <img src={src} role="img" data-testid="network-badge" />
  </div>
);

const DOT_SYMBOL_SIZE = {
  12: 8,
  16: 8,
  20: 8,
  24: 10,
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
  72: 32,
} as const;

export const getDotSymbolProps = (
  _context: 'mediaImage' | 'spot',
  variant: keyof typeof DOT_SYMBOL_SIZE
) => ({ size: DOT_SYMBOL_SIZE[variant] });

export const Skeleton = (props: SkeletonProps) => <div data-testid="skeleton" {...props} />;

export const ThemeProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

type DotIconProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  appearance: 'success' | 'muted' | 'error';
  pin?: string;
  size?: number;
  shape?: string;
  children?: ReactNode;
} & ComponentPropsWithRef<'div'>;

export const DotIcon = ({ children, icon: Icon, appearance }: DotIconProps) => (
  <div data-testid={`dot-icon-${appearance}`}>
    {children}
    <Icon size={16} />
  </div>
);

const DOT_ICON_SIZE = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
  72: 32,
} as const;

export const getDotIconProps = (
  _context: 'mediaImage' | 'spot',
  variant: keyof typeof DOT_ICON_SIZE
) => ({ size: DOT_ICON_SIZE[variant] });
