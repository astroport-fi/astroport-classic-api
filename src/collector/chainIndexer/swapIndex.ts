import { createPairLogFinders, createSwapLogFinder } from "../logFinder";
import { createPairIndexer } from "./createPairIndex";
import { FACTORY_ADDRESS } from "../../constants";
import { Pair } from "../../types";
import { TxHistoryIndexer } from "./txHistoryIndexer";
import { findProtocolRewardEmissions } from "./findProtocolRewardEmissions";
import { PriceV2 } from "../../types/priceV2.type";
import { findXAstroFees } from "./findXAstroFees";
import { voteLogFinder } from "../logFinder/voteLogFinder";
import { voteIndexer } from "./voteIndexer";
import { PoolVolume } from "../../models/pool_volume.model";

/**
 * Indexes swap transactions for a single block
 * @param txs
 * @param height
 * @param pairMap
 * @param priceMap
 */
export async function runSwapIndexer(
  txs: any,
  height: number,
  pairMap: Map<string, Pair>,
  priceMap: Map<string, PriceV2>
): Promise<void> {

  // maps pool addresses to their UST volume for this block
  const poolVolumeMap = new Map<string, number>()

  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          try {
            // swaps from tx history
            const swapLogFinder = createSwapLogFinder(pairMap);
            const swapLogFound = swapLogFinder(event);

            if (!swapLogFound) {
              return;
            }

            // transform, sum, add volume to pool_volume
            if (swapLogFound.length > 0) {
              await TxHistoryIndexer(priceMap, swapLogFound, poolVolumeMap);
            }
          } catch (e) {
            console.log("Error during finding swaps/volume: " + e);
          }
        }
      }
    }
  }

  // db operations
  const dbOps: Promise<any>[] = []

  poolVolumeMap.forEach((volume: number, pool: string) => {
    dbOps.push(
      PoolVolume.create({
        poolAddress: pool,
        block: height,
        volume: volume
      })
    )
  })

  await Promise.all(dbOps)

}