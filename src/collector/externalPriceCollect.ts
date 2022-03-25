import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { TERRA_CHAIN_ID } from "../constants";
import { getBlock } from "../services";

import { priceIndexerV2 } from "./indexer/priceIndexerV2";

dayjs.extend(utc);

export async function externalPriceCollect(): Promise<void> {
  const block = await getBlock(TERRA_CHAIN_ID);
  const height = block.hiveHeight;

  await priceIndexerV2(height);
}
