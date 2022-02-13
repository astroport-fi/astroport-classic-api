import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { TERRA_CHAIN_ID } from "../constants";
import { getBlock } from "../services";

import { priceIndexer } from "./indexer/priceIndexer";
import { Pair } from "../types";

dayjs.extend(utc);

const chainId = TERRA_CHAIN_ID;

export async function priceCollect(pairs: Pair[]): Promise<void> {

  const block = await getBlock("columbus-5")
  const height = block.hiveHeight

  await priceIndexer(pairs, height);
}
