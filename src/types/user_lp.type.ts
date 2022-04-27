export interface PairType {
  code_id: number;
  pair_type: { [key: string]: any };
  total_fee_bps: number;
  maker_fee_bps: number;
  is_disabled: boolean;
}

export interface UserLpToken {
  token1: string;
  token2: string;
  lp_token_address: string;
  pool_address: string;
  pool_type: string;
  pool_fees: number;
  staked_balance: string;
}
