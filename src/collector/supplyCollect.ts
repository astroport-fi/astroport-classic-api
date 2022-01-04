import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getContractStore } from "../lib/terra";
import { insertSupply } from '../services';
import { ASTRO_TOKEN, ASTRO_UST_PAIR, BUILDER_UNLOCK, MULTISIG } from "../constants";

/**
 * Retrieve ASTRO token supply stats every minute
 */

const INITIAL_TOKEN_SUPPLY = 1000000000 * 1000000; // 1 billion + 6 digits

export async function supplyCollect(): Promise<void> {
  console.log(process.env)

  // get circ supply
  const multisigResponse = await getContractStore(
    ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + MULTISIG + '" }}'));

  const builderBalance = await getContractStore(
    ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + BUILDER_UNLOCK + '" }}'));

  // get astro pool balance
  const astroPool = await getContractStore(
    ASTRO_UST_PAIR,
    JSON.parse('{"pool": { "address": "' + BUILDER_UNLOCK + '" }}'));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const circulatingSupply = INITIAL_TOKEN_SUPPLY - multisigResponse?.balance - builderBalance?.balance;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const astroPrice = astroPool.assets[1].amount / astroPool.assets[0].amount;


  // // TODO Total Astroport TVL
  // // TODO 24 hour volume
  await insertSupply(
    dayjs().valueOf(),
    circulatingSupply,
    astroPrice
  )
}
