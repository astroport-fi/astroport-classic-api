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
import { xAstroFeeStatMonth } from "../models/xastro_fee_stat_month.model";

dayjs.extend(utc);

/**
 * Combine fees for this month from the xastro_fee table
 *
 * Caveat: does not work for token prices that we don't have.  Ignores those.
 */

export async function aggregateXAstroFeesMonthly(priceMap: Map<string, PriceV2>): Promise<void> {
  // get latest block height
  const { height, time } = await getLatestBlock();
  const latestHeight = Number(height);

  // Get the amount of blocks since the start of this month
  // assume 6 second block time
  const blocksSinceMonthStart = Math.floor(
    (dayjs.utc().unix() - dayjs.utc().startOf("month").unix()) / 6
  );

  // get block height 30 days ago
  const startBlockHeight = latestHeight - blocksSinceMonthStart;

  // sum up the xastro_fees for this month
  const months_fees = await xAstroFee.find({
    block: { $gt: startBlockHeight, $lt: latestHeight },
  });

  let month_fees_ust = 0;
  let fees_with_no_price_count = 0;

  for (const fee of months_fees) {
    const price = priceMap.get(fee.token)?.price_ust as number;

    if (price != null) {
      let amount = fee.volume;
      // normalize amount
      if (TOKENS_WITH_8_DIGITS.has(fee.token)) {
        amount /= 100;
      }

      amount /= 1000000;

      month_fees_ust += price * amount;
    } else {
      fees_with_no_price_count += 1;
    }
  }

  console.log("Prices not found for " + fees_with_no_price_count + " fees");

  // Check if we have a previous month to calculate percent change from
  const currentYearMonthDate = dayjs.utc().format("YYYY-MM");
  const previousYearMonthDate = dayjs.utc().subtract(1, "month").format("YYYY-MM");

  let month_change = 0;
  const previousMonth = await xAstroFeeStatMonth.findOne({
    month: previousYearMonthDate,
  });
  if (previousMonth) {
    month_change = (month_fees_ust - previousMonth._fees_ust) / previousMonth._fees_ust;
  }

  await xAstroFeeStatMonth.updateOne(
    {
      month: currentYearMonthDate,
    },
    {
      $set: {
        block: latestHeight,
        month: currentYearMonthDate,
        _fees_ust: month_fees_ust,
        _fees_ust_change: month_change,
      },
    },
    { upsert: true }
  );
}
