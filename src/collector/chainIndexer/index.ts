import { createPairLogFinders, createSwapLogFinder, createWithdrawLogFinder } from "../logFinder";
import { createPairIndexer } from './createPairIndex';
import { TERRA_CHAIN_ID, GENERATOR_PROXY_CONTRACTS } from '../../constants';
import { Pair } from "../../types";
import { TxHistoryIndexer } from "./txHistoryIndexer";
import { findProtocolRewardEmissions } from "./findProtocolRewardEmissions";

const factory =
  TERRA_CHAIN_ID == 'bombay-12'
    ? 'terra1xkuxfhxa2jmjercq3ryplnj65huhlxl5mv3d6x'
    : 'terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g';

/**
 * Indexes transactions for a single block
 * @param txs
 * @param height
 * @param pairMap
 * @param lunaExchangeRate
 */
export async function runIndexers(
  txs: any,
  height: number,
  pairMap: Map<string, Pair>,
  lunaExchangeRate: number
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

          // createPair
          const createPairLF = createPairLogFinders(factory);
          const createPairLogFounds = createPairLF(event);
          if (createPairLogFounds.length > 0) {
            await createPairIndexer(createPairLogFounds, timestamp);
          }

          // find events for APR
          try {
            await findProtocolRewardEmissions(event, height);
          } catch(e) {
            console.log("Error during findProtocolRewardEmissions: " + e)
          }


          // swaps from tx history
          const swapLogFinder = createSwapLogFinder(pairMap);
          const swapLogFound = swapLogFinder(event);

          if(!swapLogFound) {
            return
          }

          // transform, sum, add volume to pool_volume
          if(swapLogFound.length > 0) {
            await TxHistoryIndexer(height, lunaExchangeRate, swapLogFound)
          }
        }
      }
    }
  }
}
