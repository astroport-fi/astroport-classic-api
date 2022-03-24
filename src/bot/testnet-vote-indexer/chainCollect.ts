import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);


const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function chainCollect(pairMap: Map<string, Pair>, priceMap: Map<string, PriceV2>): Promise<void> {
  if (TERRA_CHAIN_ID == null) {
    return;
  }

  const collectedBlock = await getBlock(TERRA_CHAIN_ID);

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

    await runIndexers(block, height, pairMap, priceMap);

    await updateBlock(TERRA_CHAIN_ID, { hiveHeight: height });

    if (height % 100 === 0) console.log(`collected: ${height} / latest height: ${lastHeight}`)

    await waitFor(200);
  }
}
