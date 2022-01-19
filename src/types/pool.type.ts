export type Pool = {
  timestamp: Date; // TODO add block height
  pool_address: string;
  trading_fee: number;
  pool_liquidity: number;
  _24hr_volume: number;
  token_symbol: string;
  trading_fees: {
    day: number;
    apr: number;
    apy: number;
  },
  astro_rewards: {
    day: number;
    apr: number;
    apy: number;
  },
  protocol_rewards: {
    day: number;
    apr: number;
    apy: number;
  },
  total_rewards: {
    day: number;
    apr: number;
    apy: number;
  }

};
