import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getLastHeight, getPairs, getPriceByPairId } from "../services";
import { ASTRO_UST_PAIR, TERRA_CHAIN_ID } from "../constants";
import { Pool } from "../models/pool.model";
import { AstroportStat } from "../models/astroport_stats.model";
dayjs.extend(utc);

const ASTRO_PAIR = ASTRO_UST_PAIR
const chainId = TERRA_CHAIN_ID
const BLOCKS_PER_YEAR = 4656810;

export async function astroportStatsCollect(): Promise<void> {

  // get latest block height
  const latestHeight = await getLastHeight(chainId)

  // get block height 24hrs ago
  // TODO - an estimation - switch over when height data correctly indexed
  const startBlockHeight = latestHeight.value - Math.floor(BLOCKS_PER_YEAR / 365)
  // const startBlockHeight = await getHeightByDate(
  //   chainId,
  //   dayjs().utc().subtract(1, 'y').toISOString());

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
  const astro = await getPriceByPairId(ASTRO_PAIR)
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
