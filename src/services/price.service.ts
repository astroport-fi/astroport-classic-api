import { Price } from '../models';

export async function getPrices(): Promise<any[]> {
  const prices = await Price.find();
  return prices;
}

export async function getPriceByPairId(pairId: string): Promise<any> {

  // TODO if no price data on astroport, use external api to get price
  // LDO pools - steth, stluna, stsol
  if(pairId == "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae" ||
     pairId == "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex" ||
     pairId == "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3") {
    return {token1: 0} // TODO change to LDO price
  }


  const price = await Price.findOne({ pair_address: pairId })
    .sort({ createdAt: -1 })
    .limit(1);

  return price;
}

export async function createPrice({
  pairId,
  pair_address,
  token1,
  token2,
  createdAt,
}: any): Promise<any> {
  const price = await Price.create({
    pair: pairId,
    pair_address,
    token1,
    token2,
    createdAt,
  });
  return price;
}
