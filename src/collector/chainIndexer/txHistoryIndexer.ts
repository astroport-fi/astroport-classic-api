import { Pair, TxHistoryTransformed } from "../../types";
import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { getUSTSwapValue } from "../helpers";
import { PoolVolume } from "../../models/pool_volume.model";
import { PriceV2 } from "../../types/priceV2.type";

/**
 * Iterates an events of a swap
 * Sums the volume by pool
 *
 * @param priceMap
 * @param founds
 * @param poolVolumeMap
 * @constructor
 */
export async function TxHistoryIndexer(
  priceMap: Map<string, PriceV2>,
  founds: ReturningLogFinderResult<TxHistoryTransformed | undefined>[],
  poolVolumeMap: Map<string, number>)
: Promise<void> {
  for (const logFound of founds) {
    const transformed = logFound.transformed;
    if (transformed) {
      if (transformed.action === "swap") {
        // get UST value of swap (from asset)
        const val: number = getUSTSwapValue(transformed, priceMap);

        poolVolumeMap.set(transformed.pair, (poolVolumeMap.get(transformed.pair) || 0) + val)
      }
    }
  }
}
