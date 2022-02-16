import { PriceV2 } from "../models/price_v2.model";

export async function getPrices():Promise<any[]> {
  const result = await PriceV2.find()
  return result
}

export async function getPriceByTokenAddress(address: string): Promise<any> {

  const result = await PriceV2.findOne({ token_address: address})
  return result

}