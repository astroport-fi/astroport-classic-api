import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { TERRA_CHAIN_ID } from "../constants";
import { getBlock } from "../services";

import { priceIndexerV2 } from "./indexer/priceIndexerV2";

const chainId = TERRA_CHAIN_ID;

export async function priceCollectV2(): Promise<void> {
  const block = await getBlock("columbus-5");
  const height = block.hiveHeight;

  await priceIndexerV2(height);
}
