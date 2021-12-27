import { createCreatePairLogFinders } from '../logFinder';
import { createPair } from '../../services/pair.service';
import { createPairIndexer } from './createPairIndex';

const createPairLF = createCreatePairLogFinders(
  'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj'
);

export async function runIndexers(txs: any): Promise<void> {
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          // createPair
          const createPairLogFounds = createPairLF(event);
          if (createPairLogFounds.length > 0) {
            await createPairIndexer(createPairLogFounds, timestamp);
          }
        }
      }
    }
  }
}
