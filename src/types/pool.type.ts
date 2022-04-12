export type Pool = {
  timestamp: Date; // TODO add block height
  pool_address: string;
  lp_address: string;
  trading_fee: number;
  pool_liquidity: number;
  _24hr_volume: number;
  token_symbol: string;
  pool_type: string;
  prices: {
    token1_address: string;
    token1_price_ust: number;
    token2_address: string;
    token2_price_ust: number;
  };
  trading_fees: {
    day: number;
    apr: number;
    apy: number;
  };
  astro_rewards: {
    day: number;
    apr: number;
    apy: number;
  };
  protocol_rewards: {
    day: number;
    apr: number;
    apy: number;
    estimated_apr: number;
  };
  total_rewards: {
    day: number;
    apr: number;
    apy: number;
  };
};

export enum PoolSortFields {
  TVL = "TVL",
  APR = "APR",
  VOLUME = "VOLUME",
}

export enum SortDirections {
  DESC = "DESC",
  ASC = "ASC",
}

export const fieldsObj = {
  [PoolSortFields.TVL]: "metadata.pool_liquidity",
  [PoolSortFields.APR]: "metadata.fees.total.apr",
  [PoolSortFields.VOLUME]: "metadata.fees.total.day",
};
export interface GetPools {
  tokenName?: string;
  poolAddress?: string;
  limit?: number;
  offset?: number;
  sortField?: PoolSortFields;
  sortDirection?: SortDirections;
}
