import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import { PoolVolume } from "../models/pool_volume.model";
import { PoolVolume7d } from "../models/pool_volume_7d.model";
import { Pair } from "../types";
import { BLOCKS_PER_YEAR, TERRA_CHAIN_ID } from "../constants";

dayjs.extend(utc);

/**
 * Combine stats for the last 7 days from the pool_volume table
 * Update the pool_volume_7d table
 */

export async function poolVolume7dCollect(pairs: Pair[]): Promise<void> {
  // get latest block height
  const latestHeight = await getLastHeight(TERRA_CHAIN_ID);
  console.log("latest height: " + latestHeight.value);

  // get block height 7d ago
  // TODO - an estimation - switch over when height data correctly indexed
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 52);
  // const startBlockHeight = await getHeightByDate(
  //   chainId,
  //   dayjs().utc().subtract(1, 'y').toISOString());

  // retrieve daily sums per pair and write to pool_volume_7d
  for (const element of pairs) {
    const pool_volumes = await PoolVolume.find({
      poolAddress: element.contractAddr,
      block: { $gt: startBlockHeight, $lt: latestHeight.value },
    });
    let sum = 0;
    pool_volumes.forEach((element) => {
      sum += element.volume;
    });

    // create or update
    await PoolVolume7d.updateOne(
      {
        pool_address: element.contractAddr,
      },
      {
        $set: {
          pool_address: element.contractAddr,
          block: latestHeight.value,
          _7d_volume: sum,
        },
      },
      { upsert: true }
    );
  }
}
