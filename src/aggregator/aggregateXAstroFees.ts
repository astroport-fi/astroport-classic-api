import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import { PoolProtocolReward } from "../models/pool_protocol_reward.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { BLOCKS_PER_YEAR, TERRA_CHAIN_ID } from "../constants";
import { xAstroFee } from "../models/xastro_fee.model";

dayjs.extend(utc);

/**
 * Combine fees for the last 24 hours from the xastro_fee table
 * Calculate APR/APY using price data and the amount of xastro staked
 */

export async function aggregateXAstroFees(): Promise<void> {

  // get latest block height
  const latestHeight = await getLastHeight(TERRA_CHAIN_ID)

  // TODO switch to 7d
  // get block height 24hrs ago
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 365)

  // sum up the last 24h of xastro_fees
  // TODO maybe go hour by hour
  const day_of_fees = await xAstroFee.find({ block: { $gt: startBlockHeight, $lt: latestHeight.value }});

  // TODO left off

}
