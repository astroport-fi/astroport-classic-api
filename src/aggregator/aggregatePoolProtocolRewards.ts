import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import { GENERATOR_PROXY_CONTRACTS, TERRA_CHAIN_ID } from "../constants";
import { PoolProtocolReward } from "../models/pool_protocol_reward.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { getLatestBlock } from "../lib/terra";

dayjs.extend(utc);

/**
 * Combine stats for the last 24 hours from the pool_volume table
 * Update the pool_protocol_rewards_24h table
 */

const chainId = TERRA_CHAIN_ID
const BLOCKS_PER_YEAR = 4656810;

export async function aggregatePoolProtocolRewards(): Promise<void> {

  // get latest block height
  const { height, time } = await getLatestBlock()
  const latestHeight = Number(height)

  // get block height 24hrs ago
  const startBlockHeight = latestHeight - Math.floor(BLOCKS_PER_YEAR / 365)

  // retrieve daily sums per pair and write to pool_protocol_rewards_24h
  for(const value of GENERATOR_PROXY_CONTRACTS.values()) {
    const pool_reward_volumes = await PoolProtocolReward.find({ pool: value.pool, block: { $gt: startBlockHeight, $lt: latestHeight }});

    let sum = 0;
    pool_reward_volumes.forEach((element) => {
      sum += element.volume
    })

    // create or update
    const prev = await PoolProtocolRewardVolume24h.findOne({pool_address: value.pool})
    if(prev) {
      await PoolProtocolRewardVolume24h.findOneAndUpdate(
        { pool_address: value.pool },
        {
          block: latestHeight,
          volume: sum
        });
    } else {
      await PoolProtocolRewardVolume24h.create({
          pool_address: value.pool,
          block: latestHeight,
          volume: sum
        });
    }
  }
}
