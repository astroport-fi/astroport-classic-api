import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getTokenSupply } from '../lib/terra';

export async function hourlyCollect(): Promise<void> {
  let {
    multisig: multisig,
    builder_unlock_contract: builder_unlock_contract} = await getTokenSupply();

  if (multisig == null || builder_unlock_contract == null) {
    return;
  }


}
