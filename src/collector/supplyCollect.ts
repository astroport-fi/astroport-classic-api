import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getContractStore } from "../lib/terra";
import { insertSupply } from '../services';
import { ASTRO_BUILDER_UNLOCK_CONTRACT, ASTRO_MULTISIG, ASTRO_TOKEN, ASTRO_UST_PAIR } from '../constants';

/**
 * Retrieve ASTRO token supply stats every minute
 */

const INITIAL_TOKEN_SUPPLY = 1000000000 * 1000000; // 1 billion + 6 digits

const builder_unlock_contract = "terra1fh27l8h4s0tfx9ykqxq5efq4xx88f06x6clwmr"
const multisig = "terra1c7m6j8ya58a2fkkptn8fgudx8sqjqvc8azq0ex"
const astro_token = "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3"
const astro_ust_pair = "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7"

export async function supplyCollect(): Promise<void> {

  // get circ supply
  const multisig_balance = await getContractStore(
    astro_token,
    JSON.parse('{"balance": { "address": "terra1c7m6j8ya58a2fkkptn8fgudx8sqjqvc8azq0ex" }}'));

  const builder_balance = await getContractStore(
    astro_token,
    JSON.parse('{"balance": { "address": "terra1fh27l8h4s0tfx9ykqxq5efq4xx88f06x6clwmr" }}'));

  // get astro pool balance
  const astro_pool = await getContractStore(
    astro_ust_pair,
    JSON.parse('{"pool": { "address": "terra1fh27l8h4s0tfx9ykqxq5efq4xx88f06x6clwmr" }}'));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const circulatingSupply = INITIAL_TOKEN_SUPPLY - multisig_balance?.balance - builder_balance?.balance;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const astroPrice = astro_pool.assets[1].amount / astro_pool.assets[0].amount;


  // // TODO Total Astroport TVL
  // // TODO 24 hour volume
  //
  await insertSupply(
    dayjs().valueOf(),
    circulatingSupply,
    astroPrice
  )
}
