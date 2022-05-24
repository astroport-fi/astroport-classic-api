export type AssetInfo = CW20AssetInfo | NativeAssetInfo;
export type CW20AssetInfo = { token: { contract_addr: string } };
export type NativeAssetInfo = { native_token: { denom: string } };

export type Route = {
  contract_addr: string;
  from: string;
  to: string;
  type: string;
};

export interface PoolAssets {
  info: AssetInfo;
  amount: string;
}

export interface SwapSimulate {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
}

export interface PoolAmounts {
  [key: string]: number;
}

export type PairResponse = {
  asset_infos: [string, string];
  /** Pair contract address */
  contract_addr: string;
  /** LP contract address (not lp minter cw20 token) */
  liquidity_token: string;
  pair_type: string;
};

export type TokenGraphEdge = {
  pair: PairResponse;
  token: string;
};

export type TokenGraphAdjacencyList = {
  [token: string]: Set<TokenGraphEdge>;
};
