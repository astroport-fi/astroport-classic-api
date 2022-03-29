import { createPairLogFinders, createSwapLogFinder } from "../logFinder";
import { createPairIndexer } from "./createPairIndex";
import { FACTORY_ADDRESS } from "../../constants";
import { Pair } from "../../types";
import { TxHistoryIndexer } from "./txHistoryIndexer";
import { findProtocolRewardEmissions } from "./findProtocolRewardEmissions";
import { PriceV2 } from "../../types/priceV2.type";
import { findXAstroFees } from "./findXAstroFees";

/**
 * Indexes transactions for a single block
 * @param txs
 * @param height
 * @param pairMap
 * @param priceMap
 */
export async function runIndexers(
  txs: any,
  height: number,
  pairMap: Map<string, Pair>,
  priceMap: Map<string, PriceV2>
): Promise<void> {
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {

          let start = new Date().getTime()

          // createPair
          try {
            const createPairLF = createPairLogFinders(FACTORY_ADDRESS);
            const createPairLogFounds = createPairLF(event);
            if (createPairLogFounds.length > 0) {
              await createPairIndexer(createPairLogFounds, timestamp);
            }
          } catch(e) {
            console.log("Error during createPair: " + e)
          }

          console.log("Create pair: " + (new Date().getTime() - start) / 1000)
          start = new Date().getTime()

          // find events for APR
          try {
            await findProtocolRewardEmissions(event, height);
          } catch(e) {
            console.log("Error during findProtocolRewardEmissions: " + e)
          }

          console.log("Protocol reward emissions: " + (new Date().getTime() - start) / 1000)
          start = new Date().getTime()

          try {
            // xAstro fees sent to maker
            await findXAstroFees(event, height);
          } catch(e) {
            console.log("Error during findXAstroFees: " + e)
          }

          console.log("xAstro fees: " + (new Date().getTime() - start) / 1000)
          start = new Date().getTime()

          try {
            // swaps from tx history
            const swapLogFinder = createSwapLogFinder(pairMap);
            const swapLogFound = swapLogFinder(event);

            if(!swapLogFound) {
              return
            }

            // transform, sum, add volume to pool_volume
            if(swapLogFound.length > 0) {
              await TxHistoryIndexer(height, priceMap, swapLogFound)
            }
          } catch(e) {
            console.log("Error during finding swaps/volume: " + e)
          }

          console.log("swaps: " + (new Date().getTime() - start) / 1000)



        }
      }
    }
  }
}
