import { connectToDatabase } from "../../modules/db";
import { FACTORY_ADDRESS, TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD } from "../../constants";
import { getTxBlockBatch, initHive, initLCD } from "../../lib/terra";
import { findXAstroFees } from "../../collector/chainIndexer/findXAstroFees";
import { createPairLogFinders } from "../../collector/logFinder";
import { createPairIndexer } from "../../collector/chainIndexer/createPairIndex";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * backfillxAstroFeesAndPairsTokens collects all transaction logs
 * since startBlock until endBlock (both inclusive)
 * @returns
 */
export async function backfillxAstroFeesAndPairsTokens() {
  initHive(TERRA_HIVE);
  initLCD(TERRA_LCD, TERRA_CHAIN_ID);
  await connectToDatabase();

  const startBlock = 5839180; // First fees collected 2021-12-27T09:54:10.828Z
  // const startBlock = 5650000; // 2021-12-12T17:12:36.085Z
  // const endBlock = 7308286; // 2022.04.19 11:02:12+02:00
  const endBlock = 6754720; // 2022-03-07T18:04:51.973Z (xastro_fee start)
  const totalBlocks = endBlock - startBlock;
  let blocksToProcess = totalBlocks;
  try {
    console.log(
      `Backfilling all xAstro fees from block ${startBlock} - ${endBlock} (${totalBlocks} total blocks)`
    );

    // Fetching blocks in batches
    let batchSize = 20;
    let totalBlocksProcessed = 0;
    const backfillStartTime: any = new Date();
    for (let height = startBlock; height < endBlock; height += batchSize) {
      const startTime: any = new Date();

      // Reduce batch to not surpass endblock
      if (height + batchSize > endBlock) {
        batchSize = endBlock - height;
      }
      const blocks = await getTxBlockBatch(height, batchSize);
      if (!blocks) {
        console.log(`Unable to retrieve blocks at height ${height}`);
        process.exit(1);
      }

      // For each block retrieves, loop over all transactions
      for (const block of blocks) {
        for (const tx of block) {
          // console.log(">", tx.height);
          const Logs = tx.logs;
          const timestamp = tx.timestamp;
          const txHash = tx.txhash;

          for (const log of Logs) {
            const events = log.events;
            for (const event of events) {
              try {
                // Log xAstro fees sent to maker
                await findXAstroFees(event, tx.height);
              } catch (e) {
                console.log("Error during findXAstroFees: " + e);
              }

              // Fetch pairs to ensure all pairs exist in collection
              // In case a pair exists, it will still attempt to create the tokens
              // Duplicates are avoided through Mongo indexes
              try {
                const createPairLF = createPairLogFinders(FACTORY_ADDRESS);
                const createPairLogFounds = createPairLF(event);
                if (createPairLogFounds.length > 0) {
                  await createPairIndexer(createPairLogFounds, timestamp, txHash);
                }
              } catch (e) {
                // console.log("Error during createPair: " + e);
              }
            }
          }
        }
      }

      // Basic progress printed every 200 blocks, basic performance printed
      // every batchSize blocks
      totalBlocksProcessed += batchSize;
      const endTime: any = new Date();
      const elapsedBatch = endTime - startTime;
      const elapsedTotal = endTime - backfillStartTime;
      console.log(
        `${height} Processed ${batchSize} blocks (${elapsedBatch.toFixed(3)} ms / ${(
          elapsedBatch / batchSize
        ).toFixed(3)} ms per block)`
      );
      blocksToProcess -= batchSize;
      // Report every 100 blocks
      if (totalBlocksProcessed % 200 === 0) {
        const averageRatePerBlockSeconds = elapsedTotal / totalBlocksProcessed / 1000;
        console.log(
          `Total time: ${(elapsedTotal / 1000 / 60).toFixed(
            3
          )} minutes. Blocks remaining: ${blocksToProcess}, estimated time: ${(
            (blocksToProcess * averageRatePerBlockSeconds) /
            60
          ).toFixed(3)} minutes`
        );
      }
    }
  } catch (error) {
    console.log("----- Unable to update backfill xAstro fees and pairs");
    console.log(error);
    return;
  }

  console.log("Backfill completed");
  process.exit(0);
}

backfillxAstroFeesAndPairsTokens();
