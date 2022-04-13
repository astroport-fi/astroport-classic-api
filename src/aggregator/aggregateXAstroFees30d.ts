import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import {
  ASTRO_TOKEN,
  BLOCKS_PER_YEAR,
  TERRA_CHAIN_ID,
  TOKENS_WITH_8_DIGITS,
  XASTRO_STAKING_ADDRESS,
} from "../constants";
import { xAstroFee } from "../models/xastro_fee.model";
import { PriceV2 } from "../types/priceV2.type";
import { getContractStore, getLatestBlock } from "../lib/terra";
import { xAstroFeeStat } from "../models/xastro_fee_stat.model";
import { xAstroFeeStatHistory } from "../models/xastro_fee_stat_history.model";

dayjs.extend(utc);

/**
 * Combine fees for the last 30 days from the xastro_fee table
 * Calculate APR/APY using price data and the amount of xastro staked
 *
 * Caveat: does not work for token prices that we don't have.  Ignores those.
 */

export async function aggregateXAstroFees30d(priceMap: Map<string, PriceV2>): Promise<void> {
  // get latest block height
  const { height, time } = await getLatestBlock();
  const latestHeight = Number(height);

  // get block height 30 days ago
  const startBlockHeight = latestHeight - Math.floor(BLOCKS_PER_YEAR / 12);

  // sum up the last 30d of xastro_fees
  const rolling_30d_of_fees = await xAstroFee.find({
    block: { $gt: startBlockHeight, $lt: latestHeight },
  });

  const astro_price = priceMap.get(ASTRO_TOKEN)?.price_ust as number;

  let _30d_fees_ust = 0;
  let fees_with_no_price_count = 0;

  for (const fee of rolling_30d_of_fees) {
    const price = priceMap.get(fee.token)?.price_ust as number;

    if (price != null) {
      let amount = fee.volume;
      // normalize amount
      if (TOKENS_WITH_8_DIGITS.has(fee.token)) {
        amount /= 100;
      }

      amount /= 1000000;

      _30d_fees_ust += price * amount;
    } else {
      fees_with_no_price_count += 1;
    }
  }

  console.log("Prices not found for " + fees_with_no_price_count + " fees");

  const total_astro_rewards = _30d_fees_ust / astro_price;

  // calculate apr, apy
  let total_astro_staked = await getContractStore(
    ASTRO_TOKEN,
    JSON.parse('{"balance": { "address": "' + XASTRO_STAKING_ADDRESS + '" }}')
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  total_astro_staked = total_astro_staked?.balance / 1000000;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const _30d_apr = (12 * total_astro_rewards) / total_astro_staked;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const _30d_apy = Math.pow(1 + total_astro_rewards / total_astro_staked, 12) - 1;

  await xAstroFeeStatHistory.create({
    block: latestHeight,
    _30d_fees_ust: _30d_fees_ust,
    _30d_apr: _30d_apr,
    _30d_apy: _30d_apy,
  });

  await xAstroFeeStat.updateOne(
    {},
    {
      $set: {
        block: latestHeight,
        _30d_fees_ust: _30d_fees_ust,
        _30d_apy: _30d_apy,
        _30d_apr: _30d_apr,
      },
    },
    { upsert: true }
  );
}
