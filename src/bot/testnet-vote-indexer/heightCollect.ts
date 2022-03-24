import { getLatestBlock } from "../../lib/terra";
import { getLastHeight } from "../../services";

const columbus4EndHeight = 8361804;
const chainId = "bombay-12";

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function heightCollect(): Promise<void> {

  const { height: lastChainHeight } = await getLatestBlock();

  if (lastChainHeight < 1 || chainId == null) {
    return;
  }

  const collectedHeight = await getLastHeight(chainId);

  if (collectedHeight == null) {
    return;
  }

  const lastHeight = collectedHeight.value;

  if (chainId === 'columbus-4' || lastHeight < columbus4EndHeight) {
    console.log("heightcollect throw")
    throw new Error(
      'this version is for the columbus-5, you have to collect columbus-4 data by using columbus-4 version of terraswap-graph first'
    );
  }

  for (
    let height = lastHeight + 100;
    height <= lastHeight + 2000;
    height += 100
  ) {
    if (height >= lastChainHeight) {
      return;
    }

    const { height: value, time } = await getChainBlock(height);
    await createHeight({ chainId, value, createdAt: time });
    await waitFor(1000);
  }
}
