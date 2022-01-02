import { Supply } from "../models/supply.model";
import { Supply as SupplyType } from "../types/supply.type"

/**
 * Return the latest supply stats
 */
export async function getSupply(): Promise<SupplyType> {
  const supply = await Supply.findOne({}).sort({timestamp: 'desc'}).exec();

  if(!supply) {
    console.log("promise rejected inside getSupply()")
    return Promise.reject()
  }

  console.log("returning inside getSupply")
  console.log("supply: " + supply)

  return {
    circulatingSupply: supply?.circulatingSupply,
    priceInUst: supply?.priceInUst,
    totalValueLockedUst: supply?.totalValueLockedUst,
    dayVolumeUst: supply?.dayVolumeUst
  };
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