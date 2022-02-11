import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getLunaExchangeRate, getPsiExchangeRate, getTxBlock } from "../lib/terra";
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

  const lunaExchangeRate = await getLunaExchangeRate("uusd");
  const psiExchangeRate = await getPsiExchangeRate()

  for (let height = lastHeight + 1; height <= lastHeight + 150; height++) {
    console.log("Current height: " + height)
    const block = await getTxBlock(height);
    if (!block) {
      console.log("Block " + height + " not found");
      return;
    }

    await runIndexers(block, height, pairMap, lunaExchangeRate, psiExchangeRate);

    await updateBlock(chainId, { hiveHeight: height });

    if (height % 100 === 0) console.log(`collected: ${height} / latest height: ${lastHeight}`)

    await waitFor(200);
  }
}
