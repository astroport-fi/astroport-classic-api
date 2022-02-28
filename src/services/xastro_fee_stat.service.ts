import { Supply } from "../models/supply.model";
import { Supply as SupplyType } from "../types/supply.type"
import { xAstroFeeStat } from "../models/xastro_fee_stat.model";
import { XAstroFeeStat } from "../types/xastro_fee_stat.type";

/**
 * Return the latest supply stats
 */
export async function getStakingStats(): Promise<XAstroFeeStat> {
  const result = await xAstroFeeStat.findOne({}).exec();

  if(!result) {
    return Promise.reject()
  }

  return {
    _24h_fees_ust: result?._24h_fees_ust,
    _24h_apr: result?._24h_apr,
    _24h_apy: result?._24h_apy,
    block: result?.block,
    _7d_fees_ust: 0,
    _7d_apr: 0,
    _7d_apy: 0
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
