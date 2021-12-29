import { Supply } from "../models/supply.model";

export async function getSupply(): Promise<any> {
  const supply = await Supply.find(); // TODO
  return supply;
}

export async function addSupply(
  object: {
    circulatingSupply?: number;
    dayVolumeUsd?: number;
    priceInUst?: number;
    totalValueLockedUST?: number;
  }
): Promise<any> {
  const supply = await Supply.create({ chainId }, object);
  return supply;
}


