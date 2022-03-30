import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { TERRA_CHAIN_ID } from "../constants";
import { getBlock } from '../services';

import { priceIndexerV2 } from "./indexer/priceIndexerV2";

export async function priceCollectV2(): Promise<void> {

  const block = await getBlock(TERRA_CHAIN_ID)
  const height = block.hiveHeight

  await priceIndexerV2(height);
}
