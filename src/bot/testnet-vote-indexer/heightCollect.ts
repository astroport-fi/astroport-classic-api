import { createHeight, getLastHeight } from "./testnetIndexerHelpers";
import { getChainBlock, getLatestBlock } from "../../lib/terra";


const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function heightCollect(): Promise<void> {

  // hive response
  const { height: lastChainHeight } = await getLatestBlock();

  if (lastChainHeight < 1) {
    return;
  }

  const collectedHeight = await getLastHeight("bombay-12");

  if (collectedHeight == null) {
    return;
  }

  const lastHeight = collectedHeight.value;

  for (
    let height = lastHeight + 100;
    height <= lastHeight + 2000;
    height += 100
  ) {
    if (height >= lastChainHeight) {
      return;
    }

    const { height: value, time } = await getChainBlock(height);
    await createHeight("bombay-12", value, time);
    await waitFor(1000);
  }
}
