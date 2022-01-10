import { PoolTimeseries } from "../types/pool_timeseries.type";
import { PoolTimeseries as PoolModel } from "../models/pool_timeseries.model";

/**
 * Save pool_timeseries snapshot to db
 */
export async function insertPoolTimeseries(
  entry: PoolTimeseries
): Promise<PoolTimeseries> {
  const pool = await PoolModel.create(entry);
  return pool;
}

export async function getOnePoolTimeseries(poolAddress: string): Promise<PoolTimeseries> {
  const pool = await PoolModel.findOne({ pool_address: poolAddress })
  return pool
}

export async function getPoolTimeseries(): Promise<PoolTimeseries[]> {
  const pools = await PoolModel.find();
  return pools
}