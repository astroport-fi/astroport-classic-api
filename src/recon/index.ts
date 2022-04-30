import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import bluebird from "bluebird";
import { createPairIndexer } from "../collector/chainIndexer/createPairIndex";
import { createPairLogFinders } from "../collector/logFinder";
import constants from "../environment/constants";

import { lambdaHandlerWrapper } from "../lib/handler-wrapper";
import { getTxBlockBatch, initHive, initLCD } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { getHeight, getLastHeight } from "../services";
import { voteLogFinder } from "../collector/logFinder/voteLogFinder";
import { voteIndexer } from "../collector/chainIndexer/voteIndexer";
import { findProtocolRewardEmissions } from "../collector/chainIndexer/findProtocolRewardEmissions";
import { findXAstroFees } from "../collector/chainIndexer/findXAstroFees";
import { getProxyAddressesInfo } from "../collector/proxyAddresses";

dayjs.extend(utc);

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

const BATCH_SIZE = 5;
const RECON_PREV_HOURS = 1;

export const run = async () => {
  // export const run = lambdaHandlerWrapper(
  //   async (): Promise<void> => {
  const start = new Date().getTime();

  console.log("Starting block recon...");

  initHive(constants.TERRA_HIVE_ENDPOINT);
  initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);
  await connectToDatabase();

  const generatorProxyContracts = await getProxyAddressesInfo();

  // Determine the block to start from and end at for the recon
  // based on the amount of hours we want to recon
  const lastBlock = await getLastHeight(constants.TERRA_CHAIN_ID);
  // const endBlockHeight = lastBlock.value;
  // console.log("ENDBLOCK", endBlockHeight);
  // console.log("constants.BLOCKS_PER_HOUR", constants.BLOCKS_PER_HOUR);
  // console.log("RECON_PREV_HOURS", RECON_PREV_HOURS);
  // const startBlock = endBlockHeight - constants.BLOCKS_PER_HOUR * RECON_PREV_HOURS;
  // const totalBlocks = endBlockHeight - startBlock;

  const startBlock = 7098190;
  const endBlockHeight = 7098290;
  const totalBlocks = endBlockHeight - startBlock;

  let blocksToProcess = totalBlocks;
  try {
    console.log(
      `Recon blocks from ${startBlock} to ${endBlockHeight} (${totalBlocks} total blocks)`
    );

    // Fetching blocks in batches
    let totalBlocksProcessed = 0;
    let blocksPerBatch = BATCH_SIZE;
    const backfillStartTime: any = new Date();
    for (let height = startBlock; height < endBlockHeight; height += blocksPerBatch) {
      const startTime: any = new Date();

      // Reduce batch to not surpass endblock
      if (height + blocksPerBatch > endBlockHeight) {
        blocksPerBatch = endBlockHeight - height;
      }
      console.log("Fetching blocks", height, blocksPerBatch);
      const blocks = await getTxBlockBatch(height, blocksPerBatch);
      if (!blocks) {
        console.log(`Unable to retrieve blocks at height ${height}`);
        process.exit(1);
      }

      // For each block retrieved, loop over all transactions
      for (const block of blocks) {
        for (const tx of block) {
          const Logs = tx.logs;
          const timestamp = tx.timestamp;
          const txHash = tx.txhash;

          for (const log of Logs) {
            const events = log.events;
            for (const event of events) {
              // for spam tx
              if (event.attributes.length < 1800) {
                // Fetch pairs to ensure all pairs exist in collection
                // In case a pair exists, it will still attempt to create the tokens
                // Duplicates are avoided through Mongo indexes
                try {
                  const createPairLF = createPairLogFinders(constants.FACTORY_ADDRESS);
                  const createPairLogFounds = createPairLF(event);
                  if (createPairLogFounds.length > 0) {
                    const created = await createPairIndexer(createPairLogFounds, timestamp, txHash);
                    console.log("Created Pair/Tokens", created.length);
                    if (created.length > 0) {
                      for (const item of created) {
                        console.log(item.pair);
                        console.log(item.tokens);
                      }
                    }
                  }
                } catch (e) {
                  console.log("Error during createPair: " + e);
                }

                // Fetch votes to ensure all votes are accounted for
                // In case a vote exists it will not be inserted
                // Duplicates are avoided through Mongo indexes specifically the
                // votes.voter+proposal_id+block index in this case
                try {
                  const voteLF = voteLogFinder();
                  const voteLogFounds = voteLF(event);
                  if (voteLogFounds.length > 0) {
                    const created = await voteIndexer(voteLogFounds, timestamp, height, txHash);
                    if (created.length > 0) {
                      console.log("Votes indexed", created.length);
                    }
                  }
                } catch (e) {
                  console.log("Error while indexing votes: " + e);
                }

                // TODO: We need an index on pool_protocol_rewards
                // consisting of pool+token+block
                try {
                  const created = await findProtocolRewardEmissions(
                    event,
                    height,
                    generatorProxyContracts
                  );
                  if (created.length > 0) {
                    console.log("Rewards indexed", created.length);
                  }
                } catch (e) {
                  console.log("Error during findProtocolRewardEmissions: " + e);
                }

                try {
                  // Log xAstro fees sent to maker
                  // Duplicates are avoided through Mongo indexes specifically the
                  // xastro_fee.block+token+volume index in this case
                  const created = await findXAstroFees(event, height);
                  if (created.length > 0) {
                    console.log("Fees indexed", created.length);
                  }
                } catch (e) {
                  console.log("Error during findXAstroFees: " + e);
                }
              }
            }
          }
        }
      }

      // // Basic progress printed every 200 blocks, basic performance printed
      // // every batchSize blocks
      // totalBlocksProcessed += batchSize;
      // const endTime: any = new Date();
      // const elapsedBatch = endTime - startTime;
      // const elapsedTotal = endTime - backfillStartTime;
      // console.log(
      //   `${height} Processed ${batchSize} blocks (${elapsedBatch.toFixed(3)} ms / ${(
      //     elapsedBatch / batchSize
      //   ).toFixed(3)} ms per block)`
      // );
      // blocksToProcess -= batchSize;
      // // Report every 200 blocks
      // if (totalBlocksProcessed % 200 === 0) {
      //   const averageRatePerBlockSeconds = elapsedTotal / totalBlocksProcessed / 1000;
      //   console.log(
      //     `Total time: ${(elapsedTotal / 1000 / 60).toFixed(
      //       3
      //     )} minutes. Blocks remaining: ${blocksToProcess}, estimated time: ${(
      //       (blocksToProcess * averageRatePerBlockSeconds) /
      //       60
      //     ).toFixed(3)} minutes`
      //   );
      // }
    }
  } catch (error) {
    console.log("Unable to recon blocks");
    console.log(error);
    return;
  }

  console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
};
// { errorMessage: "Error while running recon: ", successMessage: "recon success" }
// );

run().then(() => {
  console.log("DONE!");
});
