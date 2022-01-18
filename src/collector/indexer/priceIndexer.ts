import { getPool } from '../../lib/terra';
import { getPricesFromPool } from '../../modules/terra';
import { Pair as PairModel } from '../../models';
import { createPrice } from '../../services';
import { Pair } from "../../types";

export async function priceIndexer(
  pairs: Pair[],
  blockHeight: number
): Promise<void> {
  const priceMutations = pairs.map(async (pair: any) => {
    const data = await getPool(pair.contractAddr, blockHeight);

    if (data == null) {
      return null;
    }

    const { pool, time } = data;

    const prices = getPricesFromPool(pool, pair.token1);

    if(prices.token1 == Infinity || prices.token2 == Infinity) {
      return
    }

    // add price
    return createPrice({
      pairId: pair._id,
      ...prices,
      createdAt: time,
      updated_on_block: blockHeight
    });
  });

  try {
    await Promise.all(priceMutations);
  } catch (e) {
    console.log(e);
  }
}
