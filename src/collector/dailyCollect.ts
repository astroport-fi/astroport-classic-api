import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getLatestBlock } from '../lib/terra';
import { TERRA_CHAIN_ID } from '../constants';
import { getBlock, getHeight, updateBlock } from '../services';
import { getHeightsFromDate } from './helpers';
import { getPairs } from '../services';

import { priceIndexer } from './indexer/priceIndexer';

const chainId = TERRA_CHAIN_ID;

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

const asyncForEach = async (array: any, callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export async function dailyCollect(): Promise<void> {
  const { height: lastChainHeight } = await getLatestBlock();

  if (chainId == null) {
    return;
  }

  const collectedBlock = await getBlock(chainId);

  if (collectedBlock == null) {
    return;
  }

  const lastHeight = collectedBlock.dailyHeight;

  const lastHeightDate = await getHeight({ chainId, value: lastHeight });

  if (lastHeightDate == null) {
    return;
  }

  const lastHeightDateUtc = dayjs(lastHeightDate.createdAt)
    .hour(23)
    .minute(45)
    .second(0)
    .utc(true)
    .toISOString();

  const heights = await getHeightsFromDate(lastHeightDateUtc, 'day');

  const pairs = await getPairs();

  await asyncForEach(heights, async (height: number) => {
    if (height >= lastChainHeight) {
      return;
    }

    await priceIndexer(pairs, height);

    await updateBlock(chainId, { dailyHeight: height });

    await waitFor(1000);
  });
}
