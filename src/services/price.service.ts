import { Price } from '../models';

export async function getPrices(): Promise<any[]> {
  const prices = await Price.find();
  return prices;
}

export async function getPriceByPairId(pairId: string): Promise<any> {
  const price = await Price.findOne({ pair: pairId })
    .sort({ createdAt: -1 })
    .limit(1);

  return price;
}

export async function createPrice({
  pairId,
  token1,
  token2,
  createdAt,
}: any): Promise<any> {
  const price = await Price.create({
    pair: pairId,
    token1,
    token2,
    createdAt,
  });
  return price;
}
