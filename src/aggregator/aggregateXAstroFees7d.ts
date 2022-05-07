import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { xAstroFee } from "../models/xastro_fee.model";
import { PriceV2 } from "../types/priceV2.type";
import { getContractStore, getLatestBlock } from "../lib/terra";
import { xAstroFeeStat } from "../models/xastro_fee_stat.model";
import { xAstroFeeStatHistory } from "../models/xastro_fee_stat_history.model";
import constants from "../environment/constants";

dayjs.extend(utc);

/**
 * Combine fees for the last 7 days from the xastro_fee table
 * Calculate APR/APY using price data and the amount of xastro staked
 *
 * Caveat: does not work for token prices that we don't have.  Ignores those.
 */

export async function aggregateXAstroFees7d(priceMap: Map<string, PriceV2>): Promise<void> {
  // get latest block height
  const { height, time } = await getLatestBlock();
  const latestHeight = Number(height);

  // get block height 7 days ago
  const startBlockHeight = latestHeight - Math.floor(constants.BLOCKS_PER_YEAR / 52);

  // sum up the last 7d of xastro_fees
  const week_of_fees = await xAstroFee.find({
    block: { $gt: startBlockHeight, $lt: latestHeight },
  });

  const astro_price = priceMap.get(constants.ASTRO_TOKEN)?.price_ust as number;

  //total week fess using volume_ust
  const _7d_fees_ust_counted = week_of_fees.reduce((acc, fee) => acc + fee.volume_ust, 0);

  let _7d_fees_ust = 0;
  let fees_with_no_price_count = 0;

  for (const fee of week_of_fees) {
    const price = priceMap.get(fee.token)?.price_ust as number;

    if (price != null) {
      let amount = fee.volume;
      // normalize amount
      if (constants.TOKENS_WITH_8_DIGITS.has(fee.token)) {
        amount /= 100;
      }

      amount /= 1000000;

      _7d_fees_ust += price * amount;
    } else {
      fees_with_no_price_count += 1;
    }
  }

  console.log("Prices not found for " + fees_with_no_price_count + " fees");

  const total_astro_rewards = _7d_fees_ust / astro_price;

  // calculate apr, apy
  let total_astro_staked = await getContractStore(
    constants.ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + constants.XASTRO_STAKING_ADDRESS + '" }}')
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  total_astro_staked = total_astro_staked?.balance / 1000000;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const _7d_apr = (52 * total_astro_rewards) / total_astro_staked;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const _7d_apy = Math.pow(1 + total_astro_rewards / total_astro_staked, 52) - 1;

  await xAstroFeeStatHistory.create({
    block: latestHeight,
    _7d_fees_ust: _7d_fees_ust,
    _7d_apr: _7d_apr,
    _7d_apy: _7d_apy,
    _7d_fees_ust_counted,
  });

  await xAstroFeeStat.updateOne(
    {},
    {
      $set: {
        block: latestHeight,
        _7d_fees_ust: _7d_fees_ust,
        _7d_apr: _7d_apr,
        _7d_apy: _7d_apy,
        _7d_fees_ust_counted,
      },
    },
    { upsert: true }
  );
}
