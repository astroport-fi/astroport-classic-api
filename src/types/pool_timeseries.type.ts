export type PoolTimeseries = {
  timestamp: Date; // TODO add block height
  pool_address: string;
  lp_address: string;
  trading_fee: number;
  pool_liquidity: number;
  _24hr_volume: number;
  token_symbol: string;
  prices: {
    token1_address: string;
    token1_price_ust: number;
    token2_address: string;
    token2_price_ust: number;
  };
  fees: {
    trading: {
      day: number;
      apr: number;
      apy: number;
    };
    astro: {
      day: number;
      apr: number;
      apy: number;
    };
    native: {
      day: number;
      apr: number;
      apy: number;
    };
    total: {
      day: number;
      apr: number;
      apy: number;
    };
  };
};
