import { Supply } from "../models/supply.model";

/**
 * Return the latest supply stats
 */
export async function getSupply(): Promise<any> {
  console.log("getting supply in getSupply() in supply.service.ts")
  const supply = await Supply.findOne({}).sort({timestamp: 'desc'}).exec();
  console.log("supply: " + supply);
  return supply;
}

/**
 * Save supply snapshot to db
 */
export async function insertSupply(
  timestamp: number,
  circulatingSupply?: number,
  priceInUst?: number,
  // dayVolumeUsd?: number,
  // totalValueLockedUST?: number,
): Promise<any> {
  const supply = await Supply.create(
    {
      timestamp: timestamp,
      metadata:
        {
          circulatingSupply: circulatingSupply,
          priceInUst: priceInUst,
          // totalValueLockedUst: totalValueLockedUST,
          // dayVolumeUst: dayVolumeUsd
        }
    });
  return supply;
}