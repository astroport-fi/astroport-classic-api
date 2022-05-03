import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { batchQuery, calculatePairLiquidityFromAssets, getLatestBlock } from "../lib/terra";
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
import { CoingeckoValues } from "../types/coingecko_values.type";
import { Pair } from "../types";
import { BatchQuery } from "../types/hive.type";
import constants from "../environment/constants";
import { batchItems } from "./priceIndexer/util";

dayjs.extend(utc);

/**
 * Update the pool_timeseries table
 */

// PAIR_BATCH_SIZE determines the amount of pairs put into a Hive query batch
// 30 is a sane value to balance potential query failures and performance
// Starting with 10 to check Hive possible performance issues
const PAIR_BATCH_SIZE = 10;

const poolTimeseriesResult: any[] = [];

// TODO this file is a mess, refactor
// TODO this file is still a mess, but at least it's a fast mess for now
export async function poolCollect(): Promise<void> {
  // Get all pairs
  const pairs = await getPairs();
  const generatorProxyContracts = await getProxyAddressesInfo();

  // Map pair address -> 24h, 7d pool volume
  const dayVolumeResponse = await PoolVolume24h.find();
  const dayVolumeMap = new Map(dayVolumeResponse.map((obj) => [obj.pool_address, obj._24h_volume]));
  const weekVolumeResponse = await PoolVolume7d.find();
  const weekVolumeMap = new Map(
    weekVolumeResponse.map((obj) => [obj.pool_address, obj._7d_volume])
  );

  // Map pair address -> 24h, 7d protocol reward volume
  const protocolRewards24hRaw = await PoolProtocolRewardVolume24h.find();
  const protocolRewards24hMap = new Map(
    protocolRewards24hRaw.map((obj) => [obj.pool_address, obj.volume])
  );
  const protocolRewards7dRaw = await PoolProtocolRewardVolume7d.find();
  const protocolRewards7dMap = new Map(
    protocolRewards7dRaw.map((obj) => [obj.pool_address, obj.volume])
  );

  // Map token address -> price
  const pricesRaw = await getPrices();
  const priceMap = new Map(pricesRaw.map((price) => [price.token_address, price]));

  // Generator rewards
  const astro_price = priceMap.get(constants.ASTRO_TOKEN)?.price_ust as number;
  const { height } = await getLatestBlock();

  // Construct the batch requests and compile the results
  const pairsBatches = batchItems(pairs, PAIR_BATCH_SIZE);
  for (const pairBatch of pairsBatches) {
    const queries: BatchQuery[] = [];
    for (const pair of pairBatch) {
      const proxyInfo = generatorProxyContracts.get(pair.contractAddr);
      const lpTokenAddress = proxyInfo?.lpToken;

      // Add liquidity query
      queries.push({
        query: `
          query ($address: String!) {
            wasm {
              contractQuery(contractAddress: $address, query: { pool: {} })
            }
          }
        `,
        variables: {
          address: pair.contractAddr,
        },
      });

      // Only add generator queries for ones with proxies
      if (proxyInfo) {
        // Get the generator information for this LP token
        queries.push({
          query: `
          query ($contract: String!, $generator: String!) {
            wasm {
              contractQuery(contractAddress: $generator, query: { pool_info: { lp_token: $contract } })
            }
          }
        `,
          variables: {
            contract: lpTokenAddress,
            generator: constants.GENERATOR_ADDRESS,
          },
        });
      }
    }

    // Submit query and process responses
    if (queries.length > 0) {
      const responses = await batchQuery(queries);
      if (responses) {
        // responseIndex is tracked separately because some pairs have
        // an additional generator response
        let responseIndex = 0;

        // Remap responses to the original queries for this batch
        for (let i = 0; i < pairBatch.length; i++) {
          const pair = pairBatch[i];

          // Start constructing the timeseries result
          const result = new PoolTimeseries();

          const pairResponse = responses[responseIndex];
          const proxyInfo = generatorProxyContracts.get(pair.contractAddr);
          const rewardToken = proxyInfo?.token;

          let pairLiquidity = calculatePairLiquidityFromAssets(
            pairResponse.data.wasm.contractQuery.assets,
            priceMap
          );
          if (isNaN(pairLiquidity)) {
            pairLiquidity = 0.0;
          }

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
          result.metadata.pool_liquidity = pairLiquidity;
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
          result.metadata.fees.trading.apy = (trading_fee_perc * dayVolume * 365) / pairLiquidity;

          if (
            result.metadata.fees.trading.apy == Infinity ||
            isNaN(result.metadata.fees.trading.apy)
          ) {
            result.metadata.fees.trading.apy = 0;
          }

          // protocol rewards - like ANC for ANC-UST
          let protocolRewards24h = Number(protocolRewards24hMap.get(pair.contractAddr)) / 1000000;
          let protocolRewards7d = Number(protocolRewards7dMap.get(pair.contractAddr)) / 1000000;

          if (isNaN(protocolRewards24h)) {
            protocolRewards24h = 0;
          }

          if (isNaN(protocolRewards7d)) {
            protocolRewards7d = 0;
          }

          // TODO add config file for mapping and change price api
          // TODO also add a "standardize" function that changes the decimal to 6

          let decimals = 6;

          // 8 digits for wormhole, orion TODO
          if (constants.POOLS_WITH_8_DIGIT_REWARD_TOKENS.has(pair.contractAddr)) {
            protocolRewards24h = protocolRewards24h / 100;
            protocolRewards7d = protocolRewards7d / 100;
            decimals = 8;
          }

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
          if (isNaN(nativeTokenPrice)) {
            nativeTokenPrice = 0;
          }
          // estimate 3rd party rewards from distribution schedules
          const nativeApr = calculateThirdPartyApr({
            schedules: proxyInfo?.distribution_schedule,
            tokenPrice: nativeTokenPrice,
            totalValueLocked: pairLiquidity,
            latestBlock: height,
            decimals,
          });

          result.metadata.fees.native.estimated_apr = nativeApr;
          result.metadata.fees.native.apr = nativeApr;

          result.metadata.fees.native.day = (nativeApr * pairLiquidity) / 365; // 24 hour fee amount, not rate

          // note: can overflow to Infinity
          if (Math.pow(1 + result.metadata.fees.native.day / pairLiquidity, 365) - 1 != Infinity) {
            result.metadata.fees.native.apy =
              Math.pow(1 + result.metadata.fees.native.day / pairLiquidity, 365) - 1;
          } else {
            result.metadata.fees.native.apy = 0;
          }
          if (isNaN(result.metadata.fees.native.apr)) result.metadata.fees.native.apr = 0.0;
          if (isNaN(result.metadata.fees.native.apy)) result.metadata.fees.native.apy = 0.0;
          if (isNaN(result.metadata.fees.native.day)) result.metadata.fees.native.day = 0.0;
          if (isNaN(result.metadata.fees.native.estimated_apr)) {
            result.metadata.fees.native.estimated_apr = 0.0;
          }

          let pairAllocPoint = 0;

          // We only need to handle alloc_point and proxy addresses if there
          // is a proxy for this pair
          if (proxyInfo) {
            // Move the response index on by one to capture the second query result
            responseIndex++;
            const poolInfo = responses[responseIndex];
            pairAllocPoint = +poolInfo.data.wasm.contractQuery.alloc_point;

            let astro_yearly_emission = proxyInfo.astro_yearly_emissions || 0;
            astro_yearly_emission = astro_yearly_emission * astro_price;
            result.metadata.fees.astro.day = astro_yearly_emission / 365; // 24 hour fee amount, not rate
            result.metadata.fees.astro.apr = astro_yearly_emission / pairLiquidity;
            result.metadata.fees.astro.apy =
              Math.pow(1 + astro_yearly_emission / 365 / pairLiquidity, 365) - 1;

            result.metadata.alloc_point = pairAllocPoint;
            result.metadata.reward_proxy_address = proxyInfo.proxy;
          }

          // Safety checks
          if (isNaN(result.metadata.fees.astro.day)) result.metadata.fees.astro.day = 0.0;
          if (isNaN(result.metadata.fees.astro.apr)) result.metadata.fees.astro.apr = 0.0;
          if (isNaN(result.metadata.fees.astro.apy)) result.metadata.fees.astro.apy = 0.0;

          // total
          result.metadata.fees.total.day =
            result.metadata.fees.trading.day +
            result.metadata.fees.astro.day +
            result.metadata.fees.native.apr / 365;
          if (isNaN(result.metadata.fees.total.day)) result.metadata.fees.total.day = 0.0;

          // weekly fees
          // const weekTotalFees = (trading_fee_perc * weekVolume) +
          //   (astro_yearly_emission / 52) +
          //   (protocolRewards7d * nativeTokenPrice)

          // total yearly fees / pool liquidity
          result.metadata.fees.total.apr =
            result.metadata.fees.trading.apy +
            result.metadata.fees.astro.apr +
            result.metadata.fees.native.apr;
          if (isNaN(result.metadata.fees.total.apr)) result.metadata.fees.total.apr = 0.0;

          responseIndex++;
          poolTimeseriesResult.push(result);
        }

        if (responses.length !== queries.length) {
          // Incorrect responses, continue to next batch
          console.log(
            `Incorrect amount of responses received for queries. Received ${responses.length}, expected ${queries.length}`
          );
          continue;
        }
      } else {
        // The query batch failed, continue to next batch
        console.log("BatchRequest failed for batch, continue to next batch");
        continue;
      }
    } else {
      console.log("No queries available for this batch");
      continue;
    }
  }

  await insertPoolTimeseries(poolTimeseriesResult);
}
