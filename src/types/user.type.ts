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
  staked_lp_tokens?: UserLpToken[];
};
