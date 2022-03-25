import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CHAIN_COLLECT_BATCH_SIZE } from "../../constants";
import { getTxBlock } from "../../lib/terra";
import { runIndexers } from "./chainIndexer";
import { getBlock, updateBlock } from "./testnetIndexerHelpers";

dayjs.extend(utc);


const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function chainCollect(): Promise<void> {

  const collectedBlock = await getBlock("bombay-12");

  if (collectedBlock == null) {
    return;
  }

  const lastHeight = collectedBlock.hiveHeight;

  for (let height = lastHeight + 1; height <= lastHeight + CHAIN_COLLECT_BATCH_SIZE; height++) {
    console.log("Current height: " + height)
    const block = await getTxBlock(height);
    if (!block) {
      console.log("Block " + height + " not found");
      return;
    }

    await runIndexers(block, height);

    await updateBlock("bombay-12", { hiveHeight: height });

    if (height % 100 === 0) console.log(`collected: ${height} / latest height: ${lastHeight}`)

    await waitFor(200);
  }
}
