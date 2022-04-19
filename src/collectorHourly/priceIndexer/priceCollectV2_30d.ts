import { Pair } from "../../types";
import { getBlock } from "../../services";
import { BLOCKS_PER_DAY } from "../../constants";
import { PriceV2_30d } from "../../models/price_v2_30d.model";
import { indexPrices } from "../../collector/priceIndexer/priceCollectV2";
import { PriceGraphNode } from "../../collector/priceIndexer/price_graph_node";

/**
 * priceCollectV230d collects historic (specifically 30 days ago)
 * prices via indexPrices
 *
 * @returns
 */
export async function priceCollectV230d(pairs: Pair[]): Promise<void> {
  const block = await getBlock("columbus-5");
  // We need prices from 30 days ago, so we go back by that number of blocks
  const height = block.hiveHeight - BLOCKS_PER_DAY * 30;
  // get/calculate prices
  const prices = await indexPrices(pairs, height);
  // update prices
  await savePrices(prices);
}

async function savePrices(prices: Map<string, PriceGraphNode>) {
  for (const [key, node] of prices) {
    if (node.price_ust == 0) continue;

    await PriceV2_30d.updateOne(
      {
        token_address: node.token_address,
      },
      {
        $set: {
          token_address: node.token_address,
          price_ust: node.price_ust,
          block_last_updated: node.block_last_updated,
        },
      },
      { upsert: true }
    );
  }
}
