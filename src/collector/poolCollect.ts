import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getPairLiquidity } from "../lib/terra";
import { getPairs } from "../services";
import {
  ASTRO_TOKEN,
  ASTRO_YEARLY_EMISSIONS,
  CoingeckoValues,
  EXTERNAL_TOKENS,
  FEES,
  GENERATOR_PROXY_CONTRACTS, PAIRS_WHITELIST, POOLS_WITH_8_DIGIT_REWARD_TOKENS, STABLE_SWAP_POOLS,
  TOKEN_ADDRESS_MAP
} from "../constants";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";
import { getPrices } from "../services/priceV2.service";
import { PoolProtocolRewardVolume7d } from "../models/pool_protocol_reward_volume_7d.model";
import { PoolVolume7d } from "../models/pool_volume_7d.model";
import { PoolVolume24h } from "../models/pool_volume_24h.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { fetchExternalTokenPrice } from "./coingecko/client";


dayjs.extend(utc);

/**
 * Update the pool_timeseries table
 */

const poolTimeseriesResult: any[] = []
// TODO make this more legible
// TODO double check math
export async function poolCollect(): Promise<void> {

  // get all pairs
  const pairs = await getPairs()

  // map pair address -> 24h, 7d pool volume
  const dayVolumeResponse = await PoolVolume24h.find()
  const dayVolumeMap = new Map(dayVolumeResponse.map(obj => [obj.pool_address, obj._24h_volume]));
  const weekVolumeResponse = await PoolVolume7d.find()
  const weekVolumeMap = new Map(weekVolumeResponse.map(obj => [obj.pool_address, obj._7d_volume]));

  // map pair address -> 24h, 7d protocol reward volume
  const protocolRewards24hRaw = await PoolProtocolRewardVolume24h.find()
  const protocolRewards24hMap = new Map(protocolRewards24hRaw.map(obj => [obj.pool_address, obj.volume]));
  const protocolRewards7dRaw = await PoolProtocolRewardVolume7d.find()
  const protocolRewards7dMap = new Map(protocolRewards7dRaw.map(obj => [obj.pool_address, obj.volume]));


  // map token address -> price
  const pricesRaw = await getPrices()
  const priceMap = new Map(pricesRaw.map(price => [price.token_address, price]))

  // generator rewards
  const astro_price = priceMap.get(ASTRO_TOKEN)?.price_ust as number

  for (const pair of pairs) {
    // TODO remove after batching
    if(!PAIRS_WHITELIST.has(pair.contractAddr)) {
      continue
    }

    const result = new PoolTimeseries();

    // TODO batch hive requests
    const pool_liquidity = await getPairLiquidity(pair.contractAddr, JSON.parse('{ "pool": {} }'), priceMap)

    // STOP CHANGING THIS VALUE
    if (isNaN(pool_liquidity) || pool_liquidity < 0.01) continue

    let pool_type: string = pair.type

    if(STABLE_SWAP_POOLS.has(pair.contractAddr)) {
      pool_type = "stable"
    }

    const dayVolume = dayVolumeMap.get(pair.contractAddr) ?? 0 // in UST
    const weekVolume = weekVolumeMap.get(pair.contractAddr) ?? 0

    const trading_fee_bp = FEES.get(pool_type) ?? 20 // basis points
    const trading_fee_perc = trading_fee_bp / 10000 // percentage

    result.timestamp = dayjs().valueOf()
    result.metadata.pool_type = pool_type
    result.metadata.trading_fee_rate_bp = FEES.get(pool_type)
    result.metadata.pool_address = pair.contractAddr
    result.metadata.lp_address = pair.liquidityToken
    result.metadata.pool_liquidity = pool_liquidity
    result.metadata.day_volume_ust = dayVolume
    result.metadata.week_volume_ust = weekVolume

    result.metadata.prices = {
      token1_address: pair.token1,
      token1_price_ust: priceMap.get(pair.token1)?.price_ust ?? 0,
      token2_address: pair.token2,
      token2_price_ust: priceMap.get(pair.token2)?.price_ust ?? 0
    }

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
    let protocolRewards24h = Number(protocolRewards24hMap.get(pair.contractAddr)) / 1000000
    let protocolRewards7d = Number(protocolRewards7dMap.get(pair.contractAddr)) / 1000000

    if(isNaN(protocolRewards24h)) {
      protocolRewards24h = 0
    }

    if(isNaN(protocolRewards7d)) {
      protocolRewards7d = 0
    }

    // 8 digits for wormhole, orion TODO
    if (POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
      protocolRewards24h = protocolRewards24h / 100
      protocolRewards7d = protocolRewards7d / 100
    }

    // TODO add config file for mapping and change price api
    // TODO also add a "standardize" function that changes the decimal to 6
    const rewardToken = GENERATOR_PROXY_CONTRACTS.get(pair.contractAddr)?.token
    let nativeTokenPrice = 0
    if(priceMap.has(rewardToken)) {
      nativeTokenPrice = priceMap.get(rewardToken)?.price_ust as number
    } else if (EXTERNAL_TOKENS.has(rewardToken)) {
      const { source, address, currency } = EXTERNAL_TOKENS.get(rewardToken) as CoingeckoValues
      nativeTokenPrice = await fetchExternalTokenPrice(source, address, currency)
    } else if (rewardToken != null && protocolRewards24h != 0) {
      console.log("Reward token listed, but no price found for: " + rewardToken)
    } else {
      // no reward token listed - null
    }

    if(isNaN(nativeTokenPrice)) {
      nativeTokenPrice = 0
    }
    result.metadata.fees.native.day = protocolRewards24h * nativeTokenPrice // 24 hour fee amount, not rate
    result.metadata.fees.native.apr = (protocolRewards24h * nativeTokenPrice * 365) / pool_liquidity
    // note: can overflow to Infinity
    if(Math.pow((1 + (protocolRewards24h * nativeTokenPrice) / pool_liquidity), 365) - 1 != Infinity) {
      result.metadata.fees.native.apy = Math.pow((1 + (protocolRewards24h * nativeTokenPrice) / pool_liquidity), 365) - 1
    } else {
      result.metadata.fees.native.apy = 0
    }

    // total
    result.metadata.fees.total.day =
      result.metadata.fees.trading.day +
      result.metadata.fees.astro.day +
      result.metadata.fees.native.day

    // weekly fees
    // const weekTotalFees = (trading_fee_perc * weekVolume) +
    //   (astro_yearly_emission / 52) +
    //   (protocolRewards7d * nativeTokenPrice)

    // total yearly fees / pool liquidity
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
