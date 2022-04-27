import { VotingPower } from "./voting_power.type";
import { UserTokenHolding } from "./user_token_holding.type";
import { UserLpToken } from "./user_lp.type";

/**
 * Type User holds the core user construct.
 *
 * User's are typically wallet addresses, however, elevating the idea
 * of a wallet to a user allows for more flexibility in what it can hold in the
 * future
 */
export type User = {
  address: string;
  voting_power?: VotingPower;
  tokens?: UserTokenHolding[];
  pending_rewards?: Rewards;
  staked_lp_tokens?: UserLpToken[];
};

interface Rewards {
  bluna_ust: number;
}

//TODO move types not related to main user to another file.
export interface LockUpInfoList {
  total_astro_rewards: string;
  delegated_astro_rewards: string;
  astro_transferred: boolean;
  lockup_infos: LockupInfo[];
  lockup_positions_index: number;
}

export interface LockupInfo {
  pool_address: string;
  duration: number;
}

export interface BlunaPendingRewards {
  info: Info;
  amount: string;
}

interface Info {
  native_token: NativeToken;
}

interface NativeToken {
  denom: string;
}
