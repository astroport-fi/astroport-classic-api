import { PoolTimeseries } from "../models/pool_timeseries.model";

export async function aggregatePool(): Promise<void> {
  await PoolTimeseries.aggregate([
    { $sort: { timestamp: -1 }},
    { $group: {
        _id: "$metadata.pool_address",
        timestamp: { $first: '$timestamp' },
        metadata: { $first: '$metadata' } } },
    { $merge: {
      into: 'pool',
      on: 'metadata.pool_address',
      whenMatched: 'replace', } }
  ],
{ allowDiskUse: true })
}
