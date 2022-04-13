import { PriceV2 } from "../models/price_v2.model";
import { PriceV2_30d } from "../models/price_v2_30d.model";

export async function getPrices(): Promise<any[]> {
  const result = await PriceV2.find();
  return result;
}

export async function getHistoricPrices30d(): Promise<any[]> {
  const result = await PriceV2_30d.find();
  return result;
}

export async function getPriceByTokenAddress(address: string): Promise<any> {
  const result = await PriceV2.findOne({ token_address: address });
  return result;
}
