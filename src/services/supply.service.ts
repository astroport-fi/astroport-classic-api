import { Supply } from "../models/supply.model";

/**
 * Return the latest supply stats
 */
export async function getSupply(): Promise<any> {
  const supply = await Supply.find(); // TODO
  return supply;
}

/**
 * Save supply snapshot to db
 */
export async function insertSupply(
  timestamp: number,
  circulatingSupply?: number,
  priceInUst?: number,
  dayVolumeUsd?: number,
  totalValueLockedUST?: number,
): Promise<any> {
  const supply = await Supply.create(
    {
      timestamp: timestamp,
      metadata:
        {
          circulatingSupply: circulatingSupply,
          priceInUst: dayVolumeUsd,
          totalValueLockedUst: priceInUst,
          dayVolumeUst: totalValueLockedUST,
        }
    });
  return supply;
}