import { PoolTimeseries, PoolTimeseries as PoolType } from "../types/pool_timeseries.type";
import { PoolTimeseries as PoolModel } from "../models/pool_timeseries.model";
import { Supply } from "../models/supply.model";

/**
 * Save pool_timeseries snapshot to db
 */
export async function insertPoolTimeseries(
  entry: PoolType
): Promise<PoolType> {
  const pool = await PoolModel.create(entry);
  return pool;
}

export async function getOnePoolTimeseries(poolAddress: string): Promise<PoolType> {
  const pool = await PoolModel.findOne({ pool_address: poolAddress })
  return pool
}

export async function getPoolTimeseries(): Promise<any> {
  const pools = await PoolModel.find();
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
    trading_fee: model.metadata.trading_fee_rate_bp,
    pool_liquidity: model.metadata.pool_liquidity,
    _24hr_volume: model.metadata.day_volume_ust,
    fees: {
      trading: {
        day: model.metadata.fees.trading.day,
        apr: model.metadata.fees.trading.apr,
        apy: model.metadata.fees.trading.apy,
      },
      astro: {
        day: model.metadata.fees.astro.day,
        apr: model.metadata.fees.astro.apr,
        apy: model.metadata.fees.astro.apy,
      },
      native: {
        day: model.metadata.fees.native.day,
        apr: model.metadata.fees.native.apr,
        apy: model.metadata.fees.native.apy,
      },
      total: {
        day: model.metadata.fees.total.day,
        apr: model.metadata.fees.total.apr,
        apy: model.metadata.fees.total.apy,
      },
    }
  }
}