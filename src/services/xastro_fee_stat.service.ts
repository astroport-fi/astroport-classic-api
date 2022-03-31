import { xAstroFeeStat } from "../models/xastro_fee_stat.model";
import { XAstroFeeStat } from "../types/xastro_fee_stat.type";

/**
 * Return the latest staking stats
 */
export async function getStakingStats(): Promise<XAstroFeeStat> {
  const result = await xAstroFeeStat.findOne({}).exec();

  if (!result) {
    return Promise.reject();
  }

  let apr = result?._24h_apr;
  if (isNaN(apr) || !isFinite(apr)) {
    apr = 0;
  }

  let apy = result?._24h_apy;
  if (isNaN(apy) || !isFinite(apy)) {
    apy = 0;
  }
  return {
    _24h_fees_ust: result?._24h_fees_ust,
    _24h_apr: apr,
    _24h_apy: apy,
    block: result?.block,
    _7d_fees_ust: 0,
    _7d_apr: 0,
    _7d_apy: 0,
    updatedAt: result?.updatedAt,
  };
}
