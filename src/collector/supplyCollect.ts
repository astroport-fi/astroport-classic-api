import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";


import { getContractAddressStore, getContractStore } from "../lib/terra";
import { insertSupply } from "../services";
import { ASTRO_TOKEN, ASTRO_UST_PAIR, BUILDER_UNLOCK, MULTISIG, VESTING_ADDRESS } from "../constants";

dayjs.extend(utc);


dayjs.extend(utc);


/**
 * Retrieve ASTRO token supply stats every minute
 */

const DIGITS = 1000000;
const INITIAL_TOKEN_SUPPLY = 1000000000 * DIGITS; // 1 billion

export async function supplyCollect(): Promise<void> {
  // get circ supply
  const multisigResponse = await getContractStore(
    ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + MULTISIG + '" }}'));

  const builderBalance = await getContractStore(
    ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + BUILDER_UNLOCK + '" }}'));

  // get vestingAddress
  const vesting = await getContractAddressStore(
    ASTRO_TOKEN,
    '{"balance": { "address": "' + VESTING_ADDRESS + '" }}');

  // TODO generator contract - test when it has tokens
  // GENERATOR_ADDRESS
  // const vesting = await getContractAddressStore(
  //   ASTRO_TOKEN,
  //   '{"balance": { "address": "' + GENERATOR_ADDRESS + '" }}');

  // get astro pool balance
  const astroPool = await getContractStore(
    ASTRO_UST_PAIR,
    JSON.parse('{"pool": { "address": "' + BUILDER_UNLOCK + '" }}'));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const circulatingSupply = (INITIAL_TOKEN_SUPPLY - multisigResponse?.balance - builderBalance?.balance - JSON.parse(vesting.Result)?.balance) / DIGITS;
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
