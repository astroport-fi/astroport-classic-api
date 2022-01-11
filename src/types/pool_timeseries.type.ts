export type PoolTimeseries = {
  timestamp: Date; // TODO add block height
  pool_address: string;
  trading_fee: number;
  pool_liquidity: number;
  _24h_volume: number;
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
