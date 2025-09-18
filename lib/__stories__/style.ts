import type { CSSProperties } from 'react';
import type { Theme } from './common';

export const styles = {
  searchInput: {
    margin: '40px',
    width: '-webkit-fill-available',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #ccc',
  },
  pageMargin: {
    margin: '0px 40px',
  },
  iconGrid: {
    padding: '0.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
    justifyItems: 'center',
  },
  iconCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphaGroup: {
    marginBottom: '20px',
  },
  alphaHeader: {
    textTransform: 'uppercase',
  },
  viewportCenter: {
    height: '92vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPreview: {
    margin: '20px 0',
  },
  codeBlock: {
    backgroundColor: '#2d2d2d',
    padding: '15px 10px',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#f8f8f2',
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
} satisfies Record<string, CSSProperties>;

export const themedStyles = {
  pageBg: (theme: Theme) => ({
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F',
  }),
  panel: (theme: Theme) => ({
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#1C1D1F',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  headingColor: (theme: Theme) => ({
    color: theme === 'light' ? '#000' : '#FFF',
  }),
  subtext: (theme: Theme) => ({
    color: theme === 'light' ? '#333' : '#CCC',
  }),
  detailsText: (theme: Theme) => ({
    color: theme === 'light' ? '#333' : '#CCC',
    fontSize: '14px',
  }),
  labelContainer: () => ({
    textAlign: 'center',
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    minHeight: '42px',
    width: '100px',
  }),
  labelText: (theme: Theme) => ({
    color: theme === 'light' ? '#666' : '#AAA',
    fontSize: '10px',
    lineHeight: '1.2',
    fontFamily: 'monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100px',
    textAlign: 'center',
    cursor: 'help',
  }),
  labelTextNetwork: (theme: Theme) => ({
    color: theme === 'light' ? '#999' : '#777',
    fontSize: '9px',
    lineHeight: '1.2',
    fontFamily: 'monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100px',
    textAlign: 'center',
    cursor: 'help',
    opacity: 0.7,
  }),
} as const satisfies Record<string, (_: Theme) => CSSProperties>;
