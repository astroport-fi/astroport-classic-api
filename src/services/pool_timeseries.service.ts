import { Supply } from "../models/supply.model";
import { Supply as SupplyType } from "../types/supply.type"
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

export async function getPoolTimeseries(): Promise<any> {
  const pool = await PoolModel.find();
  return pool
}