import { getTokenPrice } from "../coingecko/client";
import { PriceV2 } from "../../models/price_v2.model";

/**
 * Currently only fetches LDO price TODO
 *
 * @param pairs
 * @param blockHeight
 */
export async function priceIndexerV2(
  blockHeight: number
): Promise<void> {
  // TODO fetch pair prices

  // TODO fetch external prices
  const LDOprice = await getTokenPrice(
    "ethereum",
    "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
    "USD"
  )

  const LDOaddress = "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z"

  // write to astroport_stats
  await PriceV2.updateOne(
    {},
    { $set: {
        tokenAddress: LDOaddress,
        price: LDOprice,
        updatedOnBlock: blockHeight
      }},
    {upsert: true})



}
