import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getHeightByDate, getLastHeight, getPairs } from "../services";
import { TERRA_CHAIN_ID } from "../constants";
import { PoolVolume } from "../models/pool_volume.model";
import { PoolVolume24h } from "../models/pool_volume_24h.model";
dayjs.extend(utc);

/**
 * Combine stats for the last 24 hours from the pool_volume table
 * Update the pool_volume_24h table
 */

const DIGITS = 1000000;
const chainId = TERRA_CHAIN_ID
const BLOCKS_PER_YEAR = 4656810;

export async function poolVolumeCollect(): Promise<void> {

  // get latest block height
  const latestHeight = await getLastHeight(chainId)
  console.log("latest height: " + latestHeight.value)

  // get block height 24hs ago
  // TODO - an estimation - switch over when height data correctly indexed
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 365)
  // const startBlockHeight = await getHeightByDate(
  //   chainId,
  //   dayjs().utc().subtract(1, 'y').toISOString());
  console.log("one year back: " + Math.floor(BLOCKS_PER_YEAR / 365))
  console.log("startBlockHeight: " + startBlockHeight)


  // get all pairs
  const pairs = await getPairs()

  // retrieve daily sums per pair and write to pool_volume_24h
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
    const prev = await PoolVolume24h.findOne({pool_address: element.contractAddr})
    if(prev) {
      await PoolVolume24h.findOneAndUpdate(
        { pool_address: element.contractAddr },
        { block: latestHeight.value, _24h_volume: sum });
    } else {
      await PoolVolume24h.create({
          pool_address: element.contractAddr,
          block: latestHeight.value,
          _24h_volume: sum
        });
    }
  }
}
