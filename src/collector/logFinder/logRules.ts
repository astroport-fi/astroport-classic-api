import { LogFinderRule } from '@terra-money/log-finder';

export function createPairRule(factoryAddress: string): LogFinderRule {
  return {
    type: 'wasm',
    attributes: [
      ['contract_address', factoryAddress],
      ['action', 'create_pair'],
      ['pair'],
      ['contract_address'],
      ['liquidity_token_addr'],
    ],
  };
}

// match swaps
export function swapRule(): LogFinderRule {
  return {
    type: 'wasm',
    attributes: [
      ['contract_address'],
      [
        'action',
        (value) => value === 'swap',
      ],
    ],
    matchUntil: 'contract_address',
  }
}