import { Pair, TxHistoryTransformed } from "../../types";
import { ReturningLogFinderResult } from '@terra-money/log-finder'
import { getUSTSwapValue } from "../helpers";
import { PoolVolume } from "../../models/pool_volume.model";
import { PriceV2 } from "../../types/priceV2.type";

/**
 * Iterates an events of a swap
 * Sums the volume by pool
 * Adds an entry to pool_volume for the block -> pool -> volume
 *
 * @param height
 * @param priceMap
 * @param founds
 * @constructor
 */
export async function TxHistoryIndexer(
  height: number,
  priceMap: Map<string, PriceV2>,
  founds: ReturningLogFinderResult<TxHistoryTransformed | undefined>[]
): Promise<void> {

  for(const logFound of founds) {
    const transformed = logFound.transformed
    if (transformed) {
      if (transformed.action === 'swap') {
        // get UST value of swap (from asset)
        const val: number = getUSTSwapValue(transformed, priceMap)

        // if found, add to pool volume
        // otherwise insert new record
        const existingPoolVolume = await PoolVolume.findOne({ poolAddress: transformed.pair, block: height })
        if(existingPoolVolume) {
          await PoolVolume.findOneAndUpdate(
            { poolAddress: transformed.pair, block: height },
            { volume: existingPoolVolume.volume + val });
        } else {
          await PoolVolume.create({ poolAddress: transformed.pair, block: height, volume: val })
        }
      }
    }
  }
}
