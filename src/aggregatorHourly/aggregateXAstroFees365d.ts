import dayjs, { locale } from "dayjs";
import utc from "dayjs/plugin/utc";
import { xAstroFee } from "../models/xastro_fee.model";
import { PriceV2 } from "../types/priceV2.type";
import { getContractStore, getLatestBlock } from "../lib/terra";
import { xAstroFeeStat } from "../models/xastro_fee_stat.model";
import { xAstroFeeStatHistory } from "../models/xastro_fee_stat_history.model";
import constants from "../environment/constants";

dayjs.extend(utc);

/**
 * Combine fees for the last 365 days from the xastro_fee table
 *
 * Caveat: does not work for token prices that we don't have.  Ignores those.
 * Caveat 2: Currently uses token prices at the end of the timeframe which will
 * be inaccurate, ideally the fees should be calculated daily with more realistic
 * token prices
 *
 * TODO: When the monthly collection is populated we can use that to provide a year's
 * fees more accurately
 */

export async function aggregateXAstroFees365d(priceMap: Map<string, PriceV2>): Promise<void> {
  // get latest block height
  const { height, time } = await getLatestBlock();
  const latestHeight = Number(height);

  // get block height 30 days ago
  const startBlockHeight = latestHeight - constants.BLOCKS_PER_YEAR;

  let _365d_fees_ust = 0;
  let fees_with_no_price_count = 0;

  // Sum total per day to avoid fetching a large amount in single query
  for (
    let i = startBlockHeight;
    i + constants.BLOCKS_PER_DAY <= latestHeight;
    i += constants.BLOCKS_PER_DAY
  ) {
    const localStart = i;
    const localEnd = i + constants.BLOCKS_PER_DAY;
    // sum up the last 365d of xastro_fees
    const local_fees = await xAstroFee.find({
      block: { $gt: localStart, $lt: localEnd },
    });

    for (const fee of local_fees) {
      const price = priceMap.get(fee.token)?.price_ust as number;

      if (price != null) {
        let amount = fee.volume;
        // normalize amount
        if (constants.TOKENS_WITH_8_DIGITS.has(fee.token)) {
          amount /= 100;
        }

        amount /= 1000000;

        _365d_fees_ust += price * amount;
      } else {
        fees_with_no_price_count += 1;
      }
    }
  }

  console.log("Prices not found for " + fees_with_no_price_count + " fees");

  // eslint-dis
  await xAstroFeeStatHistory.create({
    block: latestHeight,
    _365d_fees_ust: _365d_fees_ust,
  });

  await xAstroFeeStat.updateOne(
    {},
    {
      $set: {
        block: latestHeight,
        _365d_fees_ust: _365d_fees_ust,
      },
    },
    { upsert: true }
  );
}
