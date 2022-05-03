import { Vote } from "./vote.type";
import { xAstroFee } from "./xastro_fee.type";
import { PairIndexedResult } from "./pair.type";
import { PoolProtocolReward } from "./pool_protocol_reward.type";

/**
 * BlockRecon holds the result of a recon of a block
 */
export type BlockRecon = {
  block: number;
  pairs: PairIndexedResult[];
  votes: Vote[];
  rewards: PoolProtocolReward[];
  fees: xAstroFee[];
};
