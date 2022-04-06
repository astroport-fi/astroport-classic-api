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

  let _24h_apr = result?._24h_apr;
  if (isNaN(_24h_apr) || !isFinite(_24h_apr)) {
    _24h_apr = 0;
  }

  let _24h_apy = result?._24h_apy;
  if (isNaN(_24h_apy) || !isFinite(_24h_apy)) {
    _24h_apy = 0;
  }

  let _7d_apr = result?._7d_apr;
  if (isNaN(_7d_apr) || !isFinite(_7d_apr)) {
    _7d_apr = 0;
  }

  let _7d_apy = result?._7d_apy;
  if (isNaN(_7d_apy) || !isFinite(_7d_apy)) {
    _7d_apy = 0;
  }

  return {
    _24h_fees_ust: result?._24h_fees_ust,
    _24h_apr: _24h_apr,
    _24h_apy: _24h_apy,
    block: result?.block,
    _7d_fees_ust: result?._7d_fees_ust,
    _7d_apr: _7d_apr,
    _7d_apy: _7d_apy,
    updatedAt: result?.updatedAt,
  };
}
