import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getContractAddressStore, getContractStore, getPairLiquidity } from "../lib/terra";
import { getBlock, getHeight, getPairs, insertSupply } from "../services";
import { TERRA_CHAIN_ID } from "../constants";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";
import { PoolVolume24h } from "../models/pool_volume_24hr.model";

/**
 * Update the pool_timeseries table every minute.
 */

const DIGITS = 1000000;
const chainId = TERRA_CHAIN_ID;

// TODO get from pair registration
// fees basis points.  30 = 0.3%, 5 = 0.05%
const fees = new Map<string, number>([
  ["xyk", 30],
  ["stable", 5]
]);

export async function poolCollect(): Promise<void> {

  // get all pairs
  const pairs = await getPairs()

  for (const pair of pairs) {
    const result = new PoolTimeseries();

    const pool_type: string = pair.type
    console.log("getting liq...")

    const pool_liquidity = await getPairLiquidity(pair.contractAddr, JSON.parse('{ "pool": {} }'))
    console.log("getting 24h volume...")

    const dayVolume = await PoolVolume24h.findOne({ pool_address: pair.contractAddr })

    const trading_fee_bp = fees.get(pool_type) ?? 30
    const trading_fee_perc = trading_fee_bp / 100


    result.metadata.pool_type = pool_type
    result.metadata.trading_fee_rate_bp = fees.get(pool_type)
    result.timestamp = dayjs().valueOf()
    result.metadata.pool_address = pair.contractAddr
    result.metadata.pool_liquidity = pool_liquidity
    result.metadata.day_volume_ust = dayVolume
    
    // trading fees
    result.metadata.fees.trading.day = trading_fee_perc * dayVolume
    result.metadata.fees.trading.apr = trading_fee_perc * dayVolume * 365
    result.metadata.fees.trading.apy = Math.pow((1 + (trading_fee_perc * dayVolume) / pool_liquidity), 365)

    // generator rewards
    result.metadata.fees.astro.day = 0 // TODO
    result.metadata.fees.astro.apr = 0
    result.metadata.fees.astro.apy = 0

    // protocol rewards
    result.metadata.fees.native.day = 0
    result.metadata.fees.native.apr = 0
    result.metadata.fees.native.apy = 0

    // total
    result.metadata.fees.total.day =
      result.metadata.fees.trading.day +
      result.metadata.fees.astro.day +
      result.metadata.fees.native.day

    result.metadata.fees.total.apr = result.metadata.fees.total.day * 365
    result.metadata.fees.total.apy = Math.pow((1 + result.metadata.fees.total.day / pool_liquidity), 365)


    await insertPoolTimeseries(result)
  }
}
