import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getContractAddressStore, getContractStore } from "../lib/terra";
import { getBlock, getHeight, getPairs, insertSupply } from "../services";
import { TERRA_CHAIN_ID } from "../constants";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";

/**
 * Update the pool_timeseries table every minute.
 */

const DIGITS = 1000000;
const chainId = TERRA_CHAIN_ID;

export async function poolCollect(): Promise<void> {
  // get latest block height
  // TODO

  // get all pairs
  const pairs = await getPairs()

  for (const pair of pairs) {
    const result = new PoolTimeseries();

    result.timestamp = dayjs().valueOf()
    result.metadata.pool_address = pair.contractAddr
    result.metadata.trading_fee_rate_bp = 3
    result.metadata.pool_liquidity = 3
    result.metadata.day_volume_ust = 3
    
    // trading fees
    result.metadata.fees.trading.day = 1
    result.metadata.fees.trading.apr = 2
    result.metadata.fees.trading.apy = 3

    // generator rewards
    result.metadata.fees.astro.day = 4
    result.metadata.fees.astro.apr = 5
    result.metadata.fees.astro.apy = 6

    // native rewards
    result.metadata.fees.native.day = 7
    result.metadata.fees.native.apr = 8
    result.metadata.fees.native.apy = 9

    // total
    result.metadata.fees.total.day = 10
    result.metadata.fees.total.apr = 11
    result.metadata.fees.total.apy = 12


    await insertPoolTimeseries(result)
  }
}
