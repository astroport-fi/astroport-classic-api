import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getContractAddressStore, getContractStore, getPairLiquidity } from "../lib/terra";
import { getBlock, getHeight, getPairs, insertSupply } from "../services";
import { ASTRO_YEARLY_EMISSIONS, FEES, TERRA_CHAIN_ID } from "../constants";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";
import { PoolVolume24h } from "../models/pool_volume_24hr.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";

/**
 * Update the pool_timeseries table every minute.
 */

const DIGITS = 1000000;
const chainId = TERRA_CHAIN_ID;
const BLOCKS_PER_YEAR = 4656810



// TODO make this more legible
// TODO double check math
export async function poolCollect(): Promise<void> {

  // get all pairs
  const pairs = await getPairs()

  for (const pair of pairs) {
    const result = new PoolTimeseries();

    const pool_liquidity = await getPairLiquidity(pair.contractAddr, JSON.parse('{ "pool": {} }'))
    if(pool_liquidity == 0) return

    const pool_type: string = pair.type
    const dayVolumeResponse = await PoolVolume24h.findOne({ pool_address: pair.contractAddr })
    const dayVolume = dayVolumeResponse._24h_volume // in UST

    const trading_fee_bp = FEES.get(pool_type) ?? 30 // basis points
    const trading_fee_perc = trading_fee_bp / 10000 // percentage

    result.timestamp = dayjs().valueOf()
    result.metadata.pool_type = pool_type
    result.metadata.trading_fee_rate_bp = FEES.get(pool_type)
    result.metadata.pool_address = pair.contractAddr
    result.metadata.pool_liquidity = pool_liquidity
    result.metadata.day_volume_ust = dayVolume
    
    // trading fees
    result.metadata.fees.trading.day = trading_fee_perc * dayVolume // 24 hour fee amount, not rate
    result.metadata.fees.trading.apr = ((trading_fee_perc * dayVolume * 365) / pool_liquidity)
    result.metadata.fees.trading.apy = Math.pow((1 + (trading_fee_perc * dayVolume) / pool_liquidity), 365) - 1

    // generator rewards
    const astro_yearly_emission = ASTRO_YEARLY_EMISSIONS.get(pair.contractAddr) ?? 0
    result.metadata.fees.astro.day = astro_yearly_emission / 365 // 24 hour fee amount, not rate
    result.metadata.fees.astro.apr = astro_yearly_emission / pool_liquidity
    result.metadata.fees.astro.apy = Math.pow((1 + (astro_yearly_emission / 365) / pool_liquidity), 365) - 1

    // protocol rewards - like ANC for ANC-UST
    const protocol_rewards =
      await PoolProtocolRewardVolume24h.findOne({ pool_address: pair.contractAddr }) ?? 0
    result.metadata.fees.native.day = protocol_rewards?._24h_volume // 24 hour fee amount, not rate
    result.metadata.fees.native.apr = (protocol_rewards * 365) / pool_liquidity
    result.metadata.fees.native.apy = Math.pow((1 + (protocol_rewards?._24_volume) / pool_liquidity), 365) - 1

    // total
    result.metadata.fees.total.day =
      result.metadata.fees.trading.day +
      result.metadata.fees.astro.day +
      result.metadata.fees.native.day

    result.metadata.fees.total.apr = (result.metadata.fees.total.day * 365) / pool_liquidity
    result.metadata.fees.total.apy = Math.pow((1 + result.metadata.fees.total.day / pool_liquidity), 365) - 1


    await insertPoolTimeseries(result) //
  }
}
