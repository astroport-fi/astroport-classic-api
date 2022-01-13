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
const BLOCKS_PER_YEAR = 4656810


// TODO get from pair registration
// fees basis points.  30 = 0.3%, 5 = 0.05%
const FEES = new Map<string, number>([
  ["xyk", 30],
  ["stable", 5]
]);

// TODO get from contract
// map pair address to yearly emissions for year 1
const ASTRO_YEARLY_EMISSIONS = new Map<string, number>([
  ["terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w", 25000000], // bluna luna
  ["terra17n5sunn88hpy965mzvt3079fqx3rttnplg779g", 15000000], // astro ust
  ["terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552", 13000000], // luna ust
  ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", 10444444], // anc ust
  ["stluna", 9400000], // stluna luna TODO
  ["terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48", 3655556], // mine ust
  ["terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9", 3394444], // mir ust
  ["terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr", 3394444], // stt ust
  ["terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m", 2611111], // orion ust
  ["terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx", 2350000], // psi ust
  ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", 1827778], // apollo ust
  ["nluna", 1827778], // nluna ust TODO
  ["terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx", 1827778], // vkr ust
  ["neth", 1566667], // neth ust TODO
  ["steth", 1566667], // steth ust TODO
  ["stsol", 1566667], // stsol ust TODO
  ["xdef", 1566667], // xdef ust TODO
]);


// TODO make this more legible
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
    // TODO - figure out how to get these from
    //  https://github.com/astroport-fi/astroport-changelog/blob/master/columbus-5/1.0.0/dual-rewards_columbus.json
    result.metadata.fees.native.day = 0 // 24 hour fee amount, not rate
    result.metadata.fees.native.apr = 0
    result.metadata.fees.native.apy = 0

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
