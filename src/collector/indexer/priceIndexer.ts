import { getPool } from '../../lib/terra';
import { getPricesFromPool } from '../../modules/terra';

import { createPrice } from '../../services';

export async function priceIndexer(
  pairs: any,
  blockHeight: number
): Promise<void> {
  const priceMutations = pairs.map(async (pair: any) => {
    const data = await getPool(pair.contractAddress, blockHeight);

    if (data == null) {
      return null;
    }

    const { pool, time } = data;

    const prices = getPricesFromPool(pool, pair.token1);

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
