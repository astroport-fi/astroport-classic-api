export type Pool = {
  timestamp: Date; // TODO add block height
  pool_address: string;
  trading_fee: number;
  pool_liquidity: number;
  _24hr_volume: number;
  token_symbol: string;
  fees: {
    trading: {
      day: number;
      apr: number;
      apy: number;
    },
    astro: {
      day: number;
      apr: number;
      apy: number;
    },
    native: {
      day: number;
      apr: number;
      apy: number;
    },
    total: {
      day: number;
      apr: number;
      apy: number;
    }
  }
};
