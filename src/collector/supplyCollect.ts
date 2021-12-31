import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getTokenSupply } from '../lib/terra';
import { insertSupply } from '../services';

/**
 * Retrieve ASTRO token supply stats every minute
 */

const INITIAL_TOKEN_SUPPLY = 1000000000; // 1 billion

export async function supplyCollect(): Promise<void> {

  // get circ supply, price
  const {
    multisig: multisig,
    builder_unlock_contract: builder_unlock_contract,
    pool_astro_amount: pool_astro_amount,
    pool_ust_amount: pool_ust_amount
  } = await getTokenSupply();

  if (multisig == null || builder_unlock_contract == null) {
    return;
  }

  const currentTimeUTC = dayjs().valueOf()
  const circulatingSupply = INITIAL_TOKEN_SUPPLY - multisig - builder_unlock_contract;
  const astroPrice = pool_ust_amount / pool_astro_amount;
  // TODO Total Astroport TVL
  // TODO 24 hour volume

  await insertSupply(
    currentTimeUTC,
    circulatingSupply,
    astroPrice
  )




}
