import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getPriceByPairId } from "../services";
import { Pool } from "../models/pool.model";
import { AstroportStat } from "../models/astroport_stats.model";
import { ASTRO_UST_PAIR } from "../constants";

dayjs.extend(utc);

export async function astroportStatsCollect(): Promise<void> {

  // get all pools
  const pools = await Pool.find()

  // retrieve tvl, volume sums per pool
  let volume24hSum = 0
  let tvlSum = 0

  for (const pool of pools) {
    volume24hSum += pool.metadata.day_volume_ust
    tvlSum += pool.metadata.pool_liquidity
  }

  // get astro price
  const astro = await getPriceByPairId(ASTRO_UST_PAIR)
  const astroPrice = astro.token1

  // write to astroport_stats
  await AstroportStat.updateOne(
    {},
    { $set: {
        total_liquidity: tvlSum,
        total_volume_24h: volume24hSum,
        astro_price: astroPrice
    }},
    {upsert: true})

}
