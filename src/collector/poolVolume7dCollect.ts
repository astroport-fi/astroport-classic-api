import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getHeightByDate, getLastHeight, getPairs } from "../services";
import { TERRA_CHAIN_ID } from "../constants";
import { PoolVolume } from "../models/pool_volume.model";
import { PoolVolume7d } from "../models/pool_volume_7d.model";
import { AstroportStat } from "../models/astroport_stats.model";
dayjs.extend(utc);

/**
 * Combine stats for the last 7 days from the pool_volume table
 * Update the pool_volume_7d table
 */

const DIGITS = 1000000;
const chainId = "columbus-5"
const BLOCKS_PER_YEAR = 4656810;

export async function poolVolume7dCollect(): Promise<void> {

  // get latest block height
  const latestHeight = await getLastHeight(chainId)
  console.log("latest height: " + latestHeight.value)

  // get block height 7d ago
  // TODO - an estimation - switch over when height data correctly indexed
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 52)
  // const startBlockHeight = await getHeightByDate(
  //   chainId,
  //   dayjs().utc().subtract(1, 'y').toISOString());

  // get all pairs
  const pairs = await getPairs()

  // retrieve daily sums per pair and write to pool_volume_7d
  for (const element of pairs) {
    const pool_volumes = await PoolVolume.find(
      { poolAddress: element.contractAddr,
              block: { $gt: startBlockHeight, $lt: latestHeight.value }}
    );
    let sum = 0;
    pool_volumes.forEach((element) => {
      sum += element.volume
    })

    // create or update
    await PoolVolume7d.updateOne(
      {
        pool_address: element.contractAddr
      },
      { $set: {
          pool_address: element.contractAddr,
          block: latestHeight.value,
          _7d_volume: sum
        }},
      {upsert: true})
  }
}
