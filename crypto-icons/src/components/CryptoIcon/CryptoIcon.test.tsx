import { render } from '@testing-library/react';
import React from 'react';
import CryptoIcon from './CryptoIcon';

describe('CryptoIcon', () => {
  describe('ledger icon', () => {
    it('should fetch index.json containing icon mapping and render icon from CDN', () => {
      render(<CryptoIcon ledgerId="bitcoin" ticker="BTC" />);

      //expect
    });
  });

  describe('icon gecko fallback', () => {
    it.todo(
      'should fetch from icon gecko and render fallback icon if not found in Ledger CDN',
    );
  });

  describe('ticker icon fallback', () => {
    it.todo(
      'should use ticker icon fallback if both ledger and icon gecko are not found',
    );
    it.todo('should render first letter of currency ticker');
  });
});
