import { fetchExternalTokenPrice } from "../coingecko/client";
import { PriceV2 } from "../../models/price_v2.model";
import constants from "../../environment/constants";

/**
 *
 * @param blockHeight
 */
export async function priceIndexerV2(blockHeight: number): Promise<void> {
  // TODO fetch pair prices

  for (const [terraAddress, value] of constants.EXTERNAL_TOKENS.entries()) {
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
      // Revent to a value of 1 in case we fail to get the correct UST price
      if (terraAddress === "uusd") {
        console.log("Failed to get USD price from CoinGecko for UST, reverting to 1.0");

        await PriceV2.updateOne(
          { token_address: terraAddress },
          {
            $set: {
              token_address: terraAddress,
              price_ust: 1.0,
              block_last_updated: blockHeight,
            },
          },
          { upsert: true }
        );
      } else {
        console.log("Error during external price indexing: ", e);
      }
    }
  }
}
