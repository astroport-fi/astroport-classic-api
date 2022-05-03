export type Pair = {
  contractAddr: string;
  liquidityToken: string;
  token1: string;
  token2: string;
  type: string;
  deregistered: boolean;
  alloc_point: number;
  reward_proxy_address: string;
  description: string;
};

/**
 * PairIndexedResult reports the information indexed by createPairIndex
 */
export type PairIndexedResult = {
  pair?: Pair;
  tokens?: any[];
};
