import { fetchExternalTokenPrice } from "../coingecko/client";
import { PriceV2 } from "../../models/price_v2.model";
import { EXTERNAL_TOKENS } from "../../constants";

/**
 *
 * @param blockHeight
 */
export async function priceIndexerV2(blockHeight: number): Promise<void> {
  // TODO fetch pair prices

  for (const [terraAddress, value] of EXTERNAL_TOKENS.entries()) {
    try {
      const tokenPrice = await fetchExternalTokenPrice(value.source, value.address, value.currency);

      await PriceV2.updateOne(
        { token_address: terraAddress },
        {
          $set: {
            token_address: terraAddress,
            price_ust: tokenPrice,
            block_last_updated: blockHeight,
          },
        },
        { upsert: true }
      );
    } catch (e) {
      console.log("Error during external price indexing: ", e);
    }
  }
}
