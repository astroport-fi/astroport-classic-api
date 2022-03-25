import { voteLogFinder } from "../logFinder/voteLogFinder";
import { voteIndexer } from "./voteIndexer";

/**
 * Indexes transactions for a single block
 * @param txs
 * @param height
 */
export async function runIndexers(txs: any, height: number): Promise<void> {
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          // find votes
          try {
            const voteLF = voteLogFinder();
            const voteLogFounds = voteLF(event);
            if (voteLogFounds.length > 0) {
              await voteIndexer(voteLogFounds, timestamp, height, txHash);
            }
          } catch(e) {
            console.log("Error while indexing votes: " + e)
          }
        }
      }
    }
  }
}
