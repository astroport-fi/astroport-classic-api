import { createCreatePairLogFinders } from '../logFinder';
import { createPairIndexer } from './createPairIndex';
import { TERRA_CHAIN_ID } from '../../constants';

const factory =
  TERRA_CHAIN_ID == 'bombay-12'
    ? 'terra1xkuxfhxa2jmjercq3ryplnj65huhlxl5mv3d6x'
    : 'terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g';

const createPairLF = createCreatePairLogFinders(factory);

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