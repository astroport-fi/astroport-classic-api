import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getTokenSupply } from '../lib/terra';

/**
 * Retrieve ASTRO token supply stats every minute
 */

export async function supplyCollect(): Promise<void> {
  const {
    multisig: multisig,
    builder_unlock_contract: builder_unlock_contract } = await getTokenSupply();

  if (multisig == null || builder_unlock_contract == null) {
    return;
  }
}
