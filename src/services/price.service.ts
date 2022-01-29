import { Price } from '../models';
import { getTokenPrice } from "../collector/coingecko/client";

export async function getPrices(): Promise<any[]> {
  const prices = await Price.find();
  return prices;
}

export async function getPriceByPairId(pairId: string): Promise<any> {

  // TODO non UST based pools calculate price incorrectly
  if(pairId == "terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz" || // psi nluna
     pairId == "terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz" ) { // psi neth
    const price = await Price.findOne({pair_address: "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx"}) // psi ust
      .sort({createdAt: -1 })

    return price
  }


  // TODO if no price data on astroport, use external api to get price
  // LDO pools - steth, stluna, stsol
  if(pairId == "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae" ||
     pairId == "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex" ||
     pairId == "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3") {

    const priceResponse = await getTokenPrice(
      "ethereum",
      "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
      "USD"
    )

    return {token1: priceResponse}
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
