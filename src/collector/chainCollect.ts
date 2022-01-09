import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getTxBlock } from '../lib/terra';
import { TERRA_CHAIN_ID } from '../constants';
import { getBlock, updateBlock } from '../services';
import { Pair } from '../types';
import { runIndexers } from './chainIndexer';

dayjs.extend(utc);


const chainId = TERRA_CHAIN_ID;
const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function chainCollect(pairMap: Map<string, Pair>): Promise<void> {
  if (chainId == null) {
    return;
  }

  const collectedBlock = await getBlock(chainId);

  if (collectedBlock == null) {
    return;
  }

  const lastHeight = collectedBlock.hiveHeight;

  for (let height = lastHeight + 1; height <= lastHeight + 1000; height++) {
    const block = await getTxBlock(height);
    if (!block) {
      console.log("Block " + height + " not found")
      return;
    }

    await runIndexers(block, pairMap);

    await updateBlock(chainId, { hiveHeight: height });
    console.log(`collected ${height} `);
    await waitFor(200);
  }
}
