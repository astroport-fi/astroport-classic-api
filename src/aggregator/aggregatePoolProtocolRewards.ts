import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import { TERRA_CHAIN_ID } from "../constants";
import { PoolProtocolReward } from "../models/pool_protocol_reward.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { ProxyAddressInfo } from "../types/contracts";

dayjs.extend(utc);

/**
 * Combine stats for the last 24 hours from the pool_volume table
 * Update the pool_volume_24hr table TODO
 */

const chainId = TERRA_CHAIN_ID;
const BLOCKS_PER_YEAR = 4656810;

export async function aggregatePoolProtocolRewards(
  generatorProxyContracts: Map<string, ProxyAddressInfo>
): Promise<void> {
  // const generatorProxyContracts = await getProxyAddressesInfo();

  // get latest block height
  const latestHeight = await getLastHeight(chainId);

  // get block height 24hrs ago
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 365);

  // retrieve daily sums per pair and write to pool_protocol_rewards_24h
  for (const value of generatorProxyContracts.values()) {
    const pool_reward_volumes = await PoolProtocolReward.find({
      pool: value.pool,
      block: { $gt: startBlockHeight, $lt: latestHeight.value },
    });

    let sum = 0;
    pool_reward_volumes.forEach((element) => {
      sum += element.volume;
    });

    // create or update
    const prev = await PoolProtocolRewardVolume24h.findOne({ pool_address: value.pool });
    if (prev) {
      await PoolProtocolRewardVolume24h.findOneAndUpdate(
        { pool_address: value.pool },
        {
          block: latestHeight.value,
          volume: sum,
        }
      );
    } else {
      await PoolProtocolRewardVolume24h.create({
        pool_address: value.pool,
        block: latestHeight.value,
        volume: sum,
      });
    }
  }
}