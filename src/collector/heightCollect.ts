import constants from "../environment/constants";
import { getChainBlock, getLatestBlock } from "../lib/terra";
import { createHeight, getLastHeight } from "../services";

const columbus4EndHeight = 4_724_000;
const chainId = constants.TERRA_CHAIN_ID;

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function heightCollect(): Promise<void> {
  let { height: lastChainHeight } = await getLatestBlock();

  if (lastChainHeight < 1 || chainId == null) {
    return;
  }

  if (chainId === "columbus-4" && lastChainHeight > columbus4EndHeight) {
    lastChainHeight = columbus4EndHeight;
  }

  const collectedHeight = await getLastHeight(chainId);

  if (collectedHeight == null) {
    return;
  }

  const lastHeight = collectedHeight.value;

  if (chainId === "columbus-4" || lastHeight < columbus4EndHeight) {
    console.log("heightcollect throw");
    throw new Error(
      "this version is for the columbus-5, you have to collect columbus-4 data by using columbus-4 version of terraswap-graph first"
    );
  }

  for (let height = lastHeight + 100; height <= lastHeight + 2000; height += 100) {
    if (height >= lastChainHeight) {
      return;
    }

    const chainBlock = await getChainBlock(height);
    if (chainBlock) {
      const { height: value, time } = chainBlock;
      await createHeight({ chainId, value, createdAt: time });
      await waitFor(1000);
    } else {
      break;
    }
  }
}
