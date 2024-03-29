import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import constants from "../environment/constants";
import { getContractStore } from "../lib/terra";
import { insertSupply } from "../services";

dayjs.extend(utc);

/**
 * Retrieve ASTRO token supply stats every minute
 */

const DIGITS = 1000000;
const INITIAL_TOKEN_SUPPLY = 1000000000 * DIGITS; // 1 billion

export async function supplyCollect(): Promise<void> {
  // get circ supply
  const multisigResponse = await getContractStore(
    constants.ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + constants.MULTISIG + '" }}')
  );

  const builderBalance = await getContractStore(
    constants.ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + constants.BUILDER_UNLOCK + '" }}')
  );

  // get vestingAddress
  const vesting = await getContractStore(
    constants.ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + constants.VESTING_ADDRESS + '" }}')
  );

  // get treasury balance
  const treasury = await getContractStore(
    constants.ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + constants.ASSEMBLY_TREASURY + '" }}')
  );

  // TODO generator contract - test when it has tokens
  // GENERATOR_ADDRESS
  // const vesting = await getContractStore(
  //   ASTRO_TOKEN,
  //   JSON.parse('{"balance": { "address": "' + GENERATOR_ADDRESS + '" }}'));

  // get astro pool balance
  const astroPool = await getContractStore(
    constants.ASTRO_UST_PAIR,
    JSON.parse('{"pool": { "address": "' + constants.BUILDER_UNLOCK + '" }}')
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const circulatingSupply =
    (INITIAL_TOKEN_SUPPLY -
      multisigResponse?.balance -
      builderBalance?.balance -
      vesting?.balance -
      treasury?.balance) /
    DIGITS;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const astroPrice = astroPool.assets[1].amount / astroPool.assets[0].amount;

  // // TODO Total Astroport TVL
  // // TODO 24 hour volume
  await insertSupply(dayjs().valueOf(), circulatingSupply, astroPrice);
}
