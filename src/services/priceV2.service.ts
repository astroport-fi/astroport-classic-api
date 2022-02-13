import { Price } from "../models";
import { PriceV2 } from "../models/price_v2.model";

export async function getPrices(): Promise<any[]> {
  const prices = await Price.find();
  return prices;
}

export async function getPrice(tokenAddress: string): Promise<any> {

  // TODO only works for LDO
  if(tokenAddress == "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z" ) {
    const result = await PriceV2.findOne({ token_address: tokenAddress})
    return result
  }
}