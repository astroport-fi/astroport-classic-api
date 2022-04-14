import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLastHeight } from "../services";
import {
  ASTRO_TOKEN,
  BLOCKS_PER_DAY,
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
 * Calculates change from previous 30 days and current running 30 days
 *
 * Caveat: does not work for token prices that we don't have.  Ignores those.
 */

export async function aggregateXAstroFees30dChange(
  historicPriceMap: Map<string, PriceV2>
): Promise<void> {
  // get latest block height
  const { height, time } = await getLatestBlock();
  const latestHeight = Number(height);

  // get block height 60 days ago
  const endBlockHeight = latestHeight - Math.floor(BLOCKS_PER_DAY * 30);
  const startBlockHeight = endBlockHeight - Math.floor(BLOCKS_PER_DAY * 30);

  // sum up 30d of xastro_fees for previous period
  const previous_30d_of_fees = await xAstroFee.find({
    block: { $gt: startBlockHeight, $lt: endBlockHeight },
  });

  let _previous_30d_fees_ust = 0;
  let fees_with_no_price_count = 0;

  for (const fee of previous_30d_of_fees) {
    const price = historicPriceMap.get(fee.token)?.price_ust as number;

    if (price != null) {
      let amount = fee.volume;
      // normalize amount
      if (TOKENS_WITH_8_DIGITS.has(fee.token)) {
        amount /= 100;
      }

      amount /= 1000000;

      _previous_30d_fees_ust += price * amount;
    } else {
      fees_with_no_price_count += 1;
    }
  }

  console.log("Prices not found for " + fees_with_no_price_count + " fees (historic)");

  // Fetch current rolling 30 day fees
  const currentFees = await xAstroFeeStat.findOne();

  // Only update if we have previous fees available
  if (currentFees) {
    const previous_period_change =
      (currentFees._30d_fees_ust - _previous_30d_fees_ust) / _previous_30d_fees_ust;

    await xAstroFeeStat.updateOne(
      {},
      {
        $set: {
          _30d_fees_ust_change: previous_period_change,
        },
      },
      { upsert: true }
    );
  }
}
