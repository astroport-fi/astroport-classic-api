import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getPairLiquidity } from "../lib/terra";
import { getPairs, getPriceByPairId } from "../services";
import { ASTRO_YEARLY_EMISSIONS, FEES, TOKEN_ADDRESS_MAP } from "../constants";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { PoolVolume24h } from "../models/pool_volume_24h.model";

/**
 * Update the pool_timeseries table every minute.
 */

const ASTRO_PAIR_ADDRESS = "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7"

// orion, wormhole
const POOLS_WITH_8_DIGIT_REWARD_TOKENS = new Set<string>(
  [
    'terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m', //orion
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stLUNA luna
    'terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex', // stSOL ust
    'terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3', // stETH ust
    'terra16jaryra6dgfvkd3gqr5tcpy3p2s37stpa9sk7s', // wAVAX luna
    'terra1tehmd65kyleuwuf3a362mhnupkpza29vd86sml', // wbWBNB luna
    'terra1m32zs8725j9jzvva7zmytzasj392wpss63j2v0', // weWETH luna
    'terra16e5tgdxre44gvmjuu3ulsa64kc6eku4972yjp3', // wsSOL luna
    'terra1wr07qcmfqz2vxhcfr6k8xv8eh5es7u9mv2z07x', // wMATIC luna
    // 'terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450', // whUSDC UST
    'terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx', // whBUSD UST
    // 'terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7', // avUSDC UST
    // 'terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq', // soUSDC UST
    // 'terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu', // weUSDC UST
    'terra1mv04l9m4xc6fntxnty265rsqpnn0nk8aq0c9ge' // wgOHM UST
  ])

// externally fetched rewards - wormhole
const EXTERNALLY_FETCHED_REWARDS = new Set<string>(
  [
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stluna luna
    'terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex', // stsol ust
    'terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3', // steth ust
  ])

const STABLE_SWAP_POOLS = new Set<string>(
  [
    'terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w', // bluna luna
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stluna luna
    'terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450', // whUSDC UST
    'terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx', // whBUSD ust
    'terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7', // avUSDC ust
    'terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq', // soUSDC ust
    'terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu', // weUSDC ust
  ])

const poolTimeseriesResult: any[] = []
// TODO make this more legible
// TODO double check math
export async function poolCollect(): Promise<void> {


  // get all pairs
  const pairs = await getPairs()

  // map pair address -> 24h pool volume
  const dayVolumeResponses = await PoolVolume24h.find()
  const dayVolumes24h = new Map(dayVolumeResponses.map(obj => [obj.pool_address, obj._24h_volume]));

  // map pair address -> 24h protocol reward volume
  const protocolRewardsRaw = await PoolProtocolRewardVolume24h.find()
  const protocolRewards24h = new Map(protocolRewardsRaw.map(obj => [obj.pool_address, obj.volume]));

  // generator rewards
  let astro_price = await getPriceByPairId(ASTRO_PAIR_ADDRESS)
  astro_price = astro_price.token1

  for (const pair of pairs) {
    const result = new PoolTimeseries();

    // TODO batch hive requests
    const pool_liquidity = await getPairLiquidity(pair.contractAddr, JSON.parse('{ "pool": {} }'))

    // STOP CHANGING THIS VALUE
    if (pool_liquidity < 0.01) continue

    let pool_type: string = pair.type
    // TODO temp fix for bluna/luna => use stable, not xyk
    if(STABLE_SWAP_POOLS.has(pair.contractAddr)) {
      pool_type = "stable"
    }

    const dayVolume = dayVolumes24h.get(pair.contractAddr) ?? 0 // in UST

    const trading_fee_bp = FEES.get(pool_type) ?? 20 // basis points
    const trading_fee_perc = trading_fee_bp / 10000 // percentage

    result.timestamp = dayjs().valueOf()
    result.metadata.pool_type = pool_type
    result.metadata.trading_fee_rate_bp = FEES.get(pool_type)
    result.metadata.pool_address = pair.contractAddr
    result.metadata.pool_liquidity = pool_liquidity
    result.metadata.day_volume_ust = dayVolume

    // TODO - temporary solution
    if (TOKEN_ADDRESS_MAP.get(pair.contractAddr)) {
      result.metadata.token_symbol = TOKEN_ADDRESS_MAP.get(pair.contractAddr)
    }

    // trading fees
    result.metadata.fees.trading.day = trading_fee_perc * dayVolume // 24 hour fee amount, not rate
    result.metadata.fees.trading.apr = ((trading_fee_perc * dayVolume * 365) / pool_liquidity)
    result.metadata.fees.trading.apy = Math.pow((1 + (trading_fee_perc * dayVolume) / pool_liquidity), 365) - 1

    let astro_yearly_emission = ASTRO_YEARLY_EMISSIONS.get(pair.contractAddr) ?? 0
    astro_yearly_emission = astro_yearly_emission * astro_price
    result.metadata.fees.astro.day = astro_yearly_emission / 365 // 24 hour fee amount, not rate
    result.metadata.fees.astro.apr = astro_yearly_emission / pool_liquidity
    result.metadata.fees.astro.apy = Math.pow((1 + (astro_yearly_emission / 365) / pool_liquidity), 365) - 1

    // protocol rewards - like ANC for ANC-UST
    let protocolRewards = Number(protocolRewards24h.get(pair.contractAddr)) / 1000000
    if(isNaN(protocolRewards)) {
      protocolRewards = 0
    }

    // 8 digits for wormhole, orion TODO
    if (POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
      protocolRewards = protocolRewards / 100
    }

    // TODO this only works for pools where the corresponding reward is half the pool, i.e. ANC-UST
    // For example, It doesn't work for stLUNA-LUNA, which provides LDO rewards
    const nativeToken = await getPriceByPairId(pair.contractAddr)
    let nativeTokenPrice = nativeToken.token1

    if (POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
      // not externally fetched - coingecko gives correct price
      if(!EXTERNALLY_FETCHED_REWARDS.has(pair.contractAddr)) {
        nativeTokenPrice = nativeTokenPrice * 100
      }
    }

    if (POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
      // not externally fetched - coingecko gives correct price
      if(!EXTERNALLY_FETCHED_REWARDS.has(pair.contractAddr)) {
        nativeTokenPrice = nativeTokenPrice * 100
      }
    }

    result.metadata.fees.native.day = protocolRewards * nativeTokenPrice // 24 hour fee amount, not rate
    result.metadata.fees.native.apr = (protocolRewards * nativeTokenPrice * 365) / pool_liquidity
    // note: can overflow to Infinity
    if(Math.pow((1 + (protocolRewards * nativeTokenPrice) / pool_liquidity), 365) - 1 != Infinity) {
      result.metadata.fees.native.apy = Math.pow((1 + (protocolRewards * nativeTokenPrice) / pool_liquidity), 365) - 1
    } else {
      result.metadata.fees.native.apy = 0
    }

    // total
    result.metadata.fees.total.day =
      result.metadata.fees.trading.day +
      result.metadata.fees.astro.day +
      result.metadata.fees.native.day

    result.metadata.fees.total.apr = (result.metadata.fees.total.day * 365) / pool_liquidity
    
    if(Math.pow((1 + result.metadata.fees.total.day / pool_liquidity), 365) - 1 != Infinity) {
      result.metadata.fees.total.apy = Math.pow((1 + result.metadata.fees.total.day / pool_liquidity), 365) - 1
    } else {
      result.metadata.fees.total.apy = 0
    }

    poolTimeseriesResult.push(result)
  }
  await insertPoolTimeseries(poolTimeseriesResult)


}
