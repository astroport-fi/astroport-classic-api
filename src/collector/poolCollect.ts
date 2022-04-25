import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getGeneratorPoolInfo, getLatestBlock, getPairLiquidity } from "../lib/terra";
import { getPairs } from "../services";
import { insertPoolTimeseries } from "../services/pool_timeseries.service";
import { PoolTimeseries } from "../models/pool_timeseries.model";
import { getPrices } from "../services/priceV2.service";
import { PoolProtocolRewardVolume7d } from "../models/pool_protocol_reward_volume_7d.model";
import { PoolVolume7d } from "../models/pool_volume_7d.model";
import { PoolVolume24h } from "../models/pool_volume_24h.model";
import { PoolProtocolRewardVolume24h } from "../models/pool_protocol_reward_volume_24hr.model";
import { fetchExternalTokenPrice } from "./coingecko/client";
import { calculateThirdPartyApr } from "./chainIndexer/calculateApr";
import { getProxyAddressesInfo } from "./proxyAddresses";
import constants from "../environment/constants";
import { CoingeckoValues } from "../types/coingecko_values.type";

dayjs.extend(utc);

/**
 * Update the pool_timeseries table
 */

const poolTimeseriesResult: any[] = [];

// TODO this file is a mess, refactor
export async function poolCollect(): Promise<void> {
  // get all pairs
  const pairs = await getPairs();
  const generatorProxyContracts = await getProxyAddressesInfo();

  // map pair address -> 24h, 7d pool volume
  const dayVolumeResponse = await PoolVolume24h.find();
  const dayVolumeMap = new Map(dayVolumeResponse.map((obj) => [obj.pool_address, obj._24h_volume]));
  const weekVolumeResponse = await PoolVolume7d.find();
  const weekVolumeMap = new Map(
    weekVolumeResponse.map((obj) => [obj.pool_address, obj._7d_volume])
  );

  // map pair address -> 24h, 7d protocol reward volume
  const protocolRewards24hRaw = await PoolProtocolRewardVolume24h.find();
  const protocolRewards24hMap = new Map(
    protocolRewards24hRaw.map((obj) => [obj.pool_address, obj.volume])
  );
  const protocolRewards7dRaw = await PoolProtocolRewardVolume7d.find();
  const protocolRewards7dMap = new Map(
    protocolRewards7dRaw.map((obj) => [obj.pool_address, obj.volume])
  );

  // map token address -> price
  const pricesRaw = await getPrices();
  const priceMap = new Map(pricesRaw.map((price) => [price.token_address, price]));

  // generator rewards
  const astro_price = priceMap.get(constants.ASTRO_TOKEN)?.price_ust as number;
  const { height } = await getLatestBlock();

  for (const pair of pairs) {
    // TODO remove after batching
    if (!constants.PAIRS_WHITELIST.has(pair.contractAddr)) {
      continue;
    }

    const result = new PoolTimeseries();

    const proxyInfo = generatorProxyContracts.get(pair.contractAddr);
    const rewardToken = proxyInfo?.token;
    const lpTokenAddress = proxyInfo?.lpToken;

    // TODO batch hive requests
    const pool_liquidity = await getPairLiquidity(
      pair.contractAddr,
      JSON.parse('{ "pool": {} }'),
      priceMap
    );

    // STOP CHANGING THIS VALUE
    if (isNaN(pool_liquidity) || pool_liquidity < 0.01) continue;

    const pool_type: string = pair.type;

    const dayVolume = dayVolumeMap.get(pair.contractAddr) ?? 0; // in UST
    const weekVolume = weekVolumeMap.get(pair.contractAddr) ?? 0;

    const trading_fee_bp = constants.FEES.get(pool_type) ?? 20; // basis points
    const trading_fee_perc = trading_fee_bp / 10000; // percentage

    result.timestamp = dayjs().valueOf();
    result.metadata.pool_type = pool_type;
    result.metadata.trading_fee_rate_bp = constants.FEES.get(pool_type);
    result.metadata.pool_address = pair.contractAddr;
    result.metadata.lp_address = pair.liquidityToken;
    result.metadata.pool_liquidity = pool_liquidity;
    result.metadata.day_volume_ust = dayVolume;
    result.metadata.week_volume_ust = weekVolume;
    result.metadata.pool_description = pair.description;

    result.metadata.prices = {
      token1_address: pair.token1,
      token1_price_ust: priceMap.get(pair.token1)?.price_ust ?? 0,
      token2_address: pair.token2,
      token2_price_ust: priceMap.get(pair.token2)?.price_ust ?? 0,
    };

    // TODO - temporary solution
    if (constants.TOKEN_ADDRESS_MAP.get(pair.contractAddr)) {
      result.metadata.token_symbol = constants.TOKEN_ADDRESS_MAP.get(pair.contractAddr);
    }

    // trading fees
    result.metadata.fees.trading.day = trading_fee_perc * dayVolume; // 24 hour fee amount, not rate
    result.metadata.fees.trading.apy = (trading_fee_perc * dayVolume * 365) / pool_liquidity;

    if (result.metadata.fees.trading.apy == Infinity) {
      result.metadata.fees.trading.apy = 0;
    }

    let astro_yearly_emission = proxyInfo?.astro_yearly_emissions || 0;
    astro_yearly_emission = astro_yearly_emission * astro_price;
    result.metadata.fees.astro.day = astro_yearly_emission / 365; // 24 hour fee amount, not rate
    result.metadata.fees.astro.apr = astro_yearly_emission / pool_liquidity;
    result.metadata.fees.astro.apy =
      Math.pow(1 + astro_yearly_emission / 365 / pool_liquidity, 365) - 1;

    // protocol rewards - like ANC for ANC-UST
    let protocolRewards24h = Number(protocolRewards24hMap.get(pair.contractAddr)) / 1000000;
    let protocolRewards7d = Number(protocolRewards7dMap.get(pair.contractAddr)) / 1000000;

    if (isNaN(protocolRewards24h)) {
      protocolRewards24h = 0;
    }

    if (isNaN(protocolRewards7d)) {
      protocolRewards7d = 0;
    }

    let decimals = 6;

    // 8 digits for wormhole, orion TODO
    if (constants.POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
      protocolRewards24h = protocolRewards24h / 100;
      protocolRewards7d = protocolRewards7d / 100;
      decimals = 8;
    }

    // TODO add config file for mapping and change price api
    // TODO also add a "standardize" function that changes the decimal to 6

    const poolInfo = await getGeneratorPoolInfo(lpTokenAddress as string);

    result.metadata.alloc_point = poolInfo?.alloc_point;
    result.metadata.reward_proxy_address = proxyInfo?.proxy;

    let nativeTokenPrice = 0;
    if (priceMap.has(rewardToken)) {
      nativeTokenPrice = priceMap.get(rewardToken)?.price_ust as number;
    } else if (constants.EXTERNAL_TOKENS.has(rewardToken as string)) {
      const { source, address, currency } = constants.EXTERNAL_TOKENS.get(
        rewardToken as string
      ) as CoingeckoValues;
      nativeTokenPrice = await fetchExternalTokenPrice(source, address, currency);
    } else if (rewardToken != null && protocolRewards24h != 0) {
      console.log("Reward token listed, but no price found for: " + rewardToken);
    } else {
      // no reward token listed - null
    }

    // estimate 3rd party rewards from distribution schedules
    const nativeApr = calculateThirdPartyApr({
      schedules: proxyInfo?.distribution_schedule,
      tokenPrice: nativeTokenPrice,
      totalValueLocked: pool_liquidity,
      latestBlock: height,
      decimals,
    });

    result.metadata.fees.native.estimated_apr = nativeApr;
    result.metadata.fees.native.apr = nativeApr;
    if (isNaN(nativeTokenPrice)) {
      nativeTokenPrice = 0;
    }
    result.metadata.fees.native.day = (nativeApr * pool_liquidity) / 365; // 24 hour fee amount, not rate

    // note: can overflow to Infinity
    if (Math.pow(1 + result.metadata.fees.native.day / pool_liquidity, 365) - 1 != Infinity) {
      result.metadata.fees.native.apy =
        Math.pow(1 + result.metadata.fees.native.day / pool_liquidity, 365) - 1;
    } else {
      result.metadata.fees.native.apy = 0;
    }

    // total
    result.metadata.fees.total.day =
      result.metadata.fees.trading.day +
      result.metadata.fees.astro.day +
      result.metadata.fees.native.apr / 365;

    // weekly fees
    // const weekTotalFees = (trading_fee_perc * weekVolume) +
    //   (astro_yearly_emission / 52) +
    //   (protocolRewards7d * nativeTokenPrice)

    // total yearly fees / pool liquidity
    result.metadata.fees.total.apr =
      result.metadata.fees.trading.apy +
      result.metadata.fees.astro.apr +
      result.metadata.fees.native.apr;

    poolTimeseriesResult.push(result);
  }
  await insertPoolTimeseries(poolTimeseriesResult);
}
