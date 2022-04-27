import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import { PoolProtocolReward } from "../models/pool_protocol_reward.model";
import { PoolProtocolRewardVolume7d } from "../models/pool_protocol_reward_volume_7d.model";
import { ProxyAddressInfo } from "../types/contracts";
import constants from "../environment/constants";

dayjs.extend(utc);

/**
 * Combine stats for the last 7 days from the pool protocol rewards table
 * Update the pool_protocol_rewards_7d table
 */

export async function aggregatePoolProtocolRewards7d(
  generatorProxyContracts: Map<string, ProxyAddressInfo>
): Promise<void> {
  // get latest block height
  const latestHeight = await getLastHeight(constants.TERRA_CHAIN_ID);

  // get block height 7d ago
  // TODO - an estimation - switch over when height data correctly indexed
  const startBlockHeight = latestHeight.value - Math.floor(constants.BLOCKS_PER_YEAR / 52);

  // const startBlockHeight = await getHeightByDate(
  //   chainId,
  //   dayjs().utc().subtract(1, 'y').toISOString());

  // retrieve weekly sums per pair and write to pool_protocol_rewards_7d
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
    await PoolProtocolRewardVolume7d.updateOne(
      {
        pool_address: value.pool,
      },
      {
        $set: {
          block: latestHeight.value,
          volume: sum,
        },
      },
      { upsert: true }
    );
  }
}
