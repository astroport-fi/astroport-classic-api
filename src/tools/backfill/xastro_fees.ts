import { connectToDatabase } from "../../modules/db";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD } from "../../constants";
import { getTxBlock, getTxBlockBatch, initHive, initLCD } from "../../lib/terra";
import { findXAstroFees } from "../../collector/chainIndexer/findXAstroFees";

export async function backfillxAstroFees() {
  initHive(TERRA_HIVE);
  initLCD(TERRA_LCD, TERRA_CHAIN_ID);
  await connectToDatabase();

  // const startBlock = 5650000; // 2021-12-12T17:12:36.085Z
  // const endBlock = 7308286; // 2022.04.19 11:02:12+02:00
  const startBlock = 6300000; // Jan 31
  const endBlock = 6754721; // March 8
  const totalBlocks = endBlock - startBlock;
  let blocksToProcess = totalBlocks;
  try {
    console.log(
      `Backfilling all xAstro fees from block ${startBlock} - ${endBlock} (${totalBlocks} total blocks)`
    );

    const batchSize = 20;
    let totalBlocksProcessed = 0;
    const backfillStartTime: any = new Date();
    for (let height = startBlock; height <= endBlock; height += batchSize) {
      const startTime: any = new Date();

      const blocks = await getTxBlockBatch(height, batchSize);
      if (!blocks) {
        console.log(`Unable to retrieve blocks as height ${height}`);
        process.exit(1);
      }

      for (const block of blocks) {
        for (const tx of block) {
          // console.log(">", tx.height);

          // process.exit(0);
          const Logs = tx.logs;
          const timestamp = tx.timestamp;
          const txHash = tx.txhash;

          for (const log of Logs) {
            const events = log.events;

            for (const event of events) {
              try {
                // xAstro fees sent to maker
                await findXAstroFees(event, tx.height);
              } catch (e) {
                console.log("Error during findXAstroFees: " + e);
              }
            }
          }
        }
      }

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
    console.log("----- Unable to update backfill xAstro fees");
    console.log(error);
    return;
  }

  console.log("Backfill completed");
  process.exit(0);
}

backfillxAstroFees();
