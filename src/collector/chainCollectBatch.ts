import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLatestBlock, getTxBlock, getTxBlockBatch } from "../lib/terra";
import { getBlock, updateBlock } from "../services";
import { Pair } from "../types";
import { runIndexers, runIndexersWithProxies } from "./chainIndexer";
import { PriceV2 } from "../types/priceV2.type";
import { runSwapIndexer } from "./chainIndexer/swapIndex";
import constants from "../environment/constants";
import { getProxyAddressesInfo } from "./proxyAddresses";

dayjs.extend(utc);

// chainCollectBatch does the exact same thing as chainCollect, but uses batching
// instead
export async function chainCollectBatch(
  pairMap: Map<string, Pair>,
  priceMap: Map<string, PriceV2>
): Promise<void> {
  if (constants.TERRA_CHAIN_ID == null) {
    return;
  }

  const collectedBlock = await getBlock(constants.TERRA_CHAIN_ID);
  const lastestBlock = await getLatestBlock();

  if (collectedBlock == null) {
    return;
  }

  // From last indexed block until latest block
  const lastHeight = collectedBlock.hiveHeight;
  // Based on 0.06 per block we can do 8 000 in 8 minutes
  const endBlock = lastHeight + 8000;

  // Pre-fetch proxy contract info
  const generatorProxyContracts = await getProxyAddressesInfo();

  let batchSize = 30;
  let totalSeconds = 0;
  let totalBlocks = 0;
  for (let height = lastHeight; height < endBlock; height += batchSize) {
    if (height + batchSize > endBlock) {
      batchSize = endBlock - height;
    }

    const batchStart = new Date().getTime();
    const blocks = await getTxBlockBatch(height, batchSize);
    if (!blocks) {
      console.log(`Unable to retrieve blocks at height ${height}`);
      process.exit(1);
    }

    let currentHeight = height;
    for (const block of blocks) {
      console.log("Current height: " + currentHeight);

      await runIndexersWithProxies(block, currentHeight, generatorProxyContracts);
      await runSwapIndexer(block, currentHeight, pairMap, priceMap);

      await updateBlock(constants.TERRA_CHAIN_ID, { hiveHeight: currentHeight });

      currentHeight++;
    }

    // Calculate time remaining output
    const batchElapsed = (new Date().getTime() - batchStart) / 1000;
    totalSeconds += batchElapsed;
    totalBlocks += batchSize;
    const avgSecondsPerBlock = totalSeconds / totalBlocks;
    const secondsRemaining = (lastestBlock.height - currentHeight - 1) * avgSecondsPerBlock;

    console.log(
      `[${currentHeight - 1}/${
        lastestBlock.height
      }] Collected ${batchSize} blocks in ${batchElapsed.toFixed(2)} s (${(
        batchElapsed / batchSize
      ).toFixed(2)} s per block). Remaining ${(secondsRemaining / 60).toFixed(2)} mins (${(
        secondsRemaining /
        60 /
        60
      ).toFixed(2)} hours)`
    );
  }
}
