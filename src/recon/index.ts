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
import { BlockRecon } from "../types/block_recon.type";

dayjs.extend(utc);

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

const BATCH_SIZE = 10;
const RECON_PREV_HOURS = 1;

/**
 * The Recon service checks for any missing events from current
 * height - blocks since specific timeframe
 *
 * It checks for pairs, tokens, votes, rewards and fees
 */
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

  // const startBlock = 7098190; // For all other testing mainnet
  // const endBlockHeight = 7208190; // For all other testing mainnet

  const startBlock = 7209321; // For votes on mainnet
  // const endBlockHeight = 7209421; // For votes on mainnet
  const endBlockHeight = 7209421; // For votes on mainnet
  // const endBlockHeight = 7309321; // For votes on mainnet

  const totalBlocks = endBlockHeight - startBlock;

  let blocksToProcess = totalBlocks;

  console.log(`Recon blocks from ${startBlock} to ${endBlockHeight} (${totalBlocks} total blocks)`);

  // Fetching blocks in batches
  let totalBlocksProcessed = 0;
  let blocksPerBatch = BATCH_SIZE;
  const blockRecons: BlockRecon[] = [];
  for (let height = startBlock; height < endBlockHeight; height += blocksPerBatch) {
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
      const blockRecon: BlockRecon = {
        block: 0,
        pairs: [],
        votes: [],
        rewards: [],
        fees: [],
      };
      for (const tx of block) {
        const Logs = tx.logs;
        const timestamp = tx.timestamp;
        const txHash = tx.txhash;

        // height isn't available on block when fetching batches
        blockRecon.block = tx.height;

        for (const log of Logs) {
          const events = log.events;
          for (const event of events) {
            // for spam tx
            if (event.attributes.length < 1800) {
              // Fetch pairs to ensure all pairs exist in collection
              // Duplicates are avoided through Mongo indexes, specifically
              // pairs.contractAddr and tokens.tokenAddr
              try {
                const createPairLF = createPairLogFinders(constants.FACTORY_ADDRESS);
                const createPairLogFounds = createPairLF(event);
                if (createPairLogFounds.length > 0) {
                  const created = await createPairIndexer(createPairLogFounds, timestamp, txHash);
                  if (created.length > 0) {
                    blockRecon.pairs = created;
                  }
                }
              } catch (e) {
                // Not printing duplicate insert errors
                // console.log("Error during createPair: " + e);
              }

              // Fetch votes to ensure all votes are accounted for
              // Duplicates are avoided through Mongo indexes specifically the
              // votes.voter+proposal_id+block index in this case
              try {
                const voteLF = voteLogFinder();
                const voteLogFounds = voteLF(event);
                if (voteLogFounds.length > 0) {
                  const created = await voteIndexer(voteLogFounds, timestamp, height, txHash);
                  if (created.length > 0) {
                    blockRecon.votes = created;
                  }
                }
              } catch (e) {
                // Not printing duplicate insert errors
                // console.log("Error while indexing votes: " + e);
              }

              // Fetch protocol rewards
              // TODO: We need an index on pool_protocol_rewards
              // consisting of pool+token+block+volume
              try {
                const created = await findProtocolRewardEmissions(
                  event,
                  height,
                  generatorProxyContracts
                );
                if (created.length > 0) {
                  blockRecon.rewards = created;
                }
              } catch (e) {
                // Not printing duplicate insert errors
                // console.log("Error during findProtocolRewardEmissions: " + e);
              }

              // Log xAstro fees sent to maker
              // Duplicates are avoided through Mongo indexes specifically the
              // xastro_fee.block+token+volume index in this case
              try {
                const created = await findXAstroFees(event, height);
                if (created.length > 0) {
                  blockRecon.fees = created;
                }
              } catch (e) {
                // Not printing duplicate insert errors
                // console.log("Error during findXAstroFees: " + e);
              }
            }
          }
        }
      }
      // Only add if any missed events were found
      if (
        blockRecon.pairs.length ||
        blockRecon.votes.length ||
        blockRecon.rewards.length ||
        blockRecon.fees.length
      ) {
        blockRecons.push(blockRecon);
      }
    }
  }

  if (blockRecons.length > 0) {
    console.log("RECON ENVETS BLOCK COUNT:", blockRecons.length);

    let totalPairs = 0;
    let totalVotes = 0;
    let totalRewards = 0;
    let totalFees = 0;
    for (const blockRecon of blockRecons) {
      totalPairs += blockRecon.pairs.length;
      totalVotes += blockRecon.votes.length;
      totalRewards += blockRecon.rewards.length;
      totalFees += blockRecon.fees.length;
    }

    console.log("totalPairs", totalPairs);
    console.log("totalVotes", totalVotes);
    console.log("totalRewards", totalRewards);
    console.log("totalFees", totalFees);

    // TODO: Push result to slack
  }

  console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
};
// { errorMessage: "Error while running recon: ", successMessage: "recon success" }
// );

run().then(() => {
  console.log("DONE!");
});
