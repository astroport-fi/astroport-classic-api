import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getLatestBlock, getTxBlock } from '../lib/terra';
import { TERRA_CHAIN_ID } from '../constants';
import { getBlock, updateBlock } from '../services';

import { runIndexers } from './chainIndexer';



const chainId = TERRA_CHAIN_ID;
const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function chainCollect(): Promise<void> {
  if (chainId == null) {
    return;
  }

  const collectedBlock = await getBlock(chainId);

  if (collectedBlock == null) {
    return;
  }

  const lastHeight = collectedBlock.hiveHeight;

  for (let height = lastHeight + 1; height <= lastHeight + 50; height++) {
    const block = await getTxBlock(height);
    if (!block) return;

    await runIndexers(block);

    await updateBlock(chainId, { hiveHeight: height });
    console.log(`collected ${height} `);
    await waitFor(200);
  }
}
