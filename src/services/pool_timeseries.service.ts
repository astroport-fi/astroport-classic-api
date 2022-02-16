import { PoolTimeseries as PoolType } from "../types/pool_timeseries.type";
import { PoolTimeseries as PoolModel } from "../models/pool_timeseries.model";

/**
 * Save pool_timeseries snapshot to db
 */
export async function insertPoolTimeseries(
  entries: PoolType[]
) {
  await PoolModel.insertMany(entries)
}

export async function getPoolTimeseries(): Promise<any> {
  const pools = await PoolModel.find({}, null, {limit: 100})
  const result = []

  // map
  for(const pool of pools) {
    result.push(transformPoolModelToPoolType({ model: pool }))
  }

  return result
}

function transformPoolModelToPoolType({ model }: { model: any }) {

  return {
    timestamp: model.timestamp,
    pool_address: model.metadata.pool_address,
    lp_address: model.metadata.lp_address,
    trading_fee: model.metadata.trading_fee_rate_bp,
    pool_liquidity: model.metadata.pool_liquidity,
    _24h_volume: model.metadata.day_volume_ust,
    prices: {
      token1_address: model.metadata.prices.token1_address,
      token1_price_ust: model.metadata.prices.token1_price_ust,
      token2_address: model.metadata.prices.token2_address,
      token2_price_ust: model.metadata.prices.token2_price_ust,
    },
    trading_fees: {
      day: model.metadata.fees.trading.day,
      apr: model.metadata.fees.trading.apr,
      apy: model.metadata.fees.trading.apy,
    },
    astro_rewards: {
      day: model.metadata.fees.astro.day,
      apr: model.metadata.fees.astro.apr,
      apy: model.metadata.fees.astro.apy,
    },
    protocol_rewards: {
      day: model.metadata.fees.native.day,
      apr: model.metadata.fees.native.apr,
      apy: model.metadata.fees.native.apy,
    },
    total_rewards: {
      day: model.metadata.fees.total.day,
      apr: model.metadata.fees.total.apr,
      apy: model.metadata.fees.total.apy,
    }
  }
}