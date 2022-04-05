export interface PoolInfo {
  alloc_point: string;
  astro_tokens_per_block: string;
  last_reward_block: number;
  current_block: number;
  accumulated_rewards_per_share: string;
  pending_astro_rewards: string;
  reward_proxy: string;
  pending_proxy_rewards: string;
  accumulated_proxy_rewards_per_share: string;
  proxy_reward_balance_before_update: string;
  orphan_proxy_rewards: string;
}

export interface PoolConfig {
  generator_contract_addr: string;
  pair_addr: string;
  lp_token_addr: string;
  reward_contract_addr: string;
  reward_token_addr: string;
}
