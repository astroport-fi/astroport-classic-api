import { AstroportStat } from "../models/astroport_stats.model";

export async function getStats(): Promise<any> {
  const stats = await AstroportStat.findOne();

  return {
    total_liquidity: stats?.total_liquidity,
    total_volume_24h: stats?.total_volume_24h,
    astro_price: stats?.astro_price,
    updatedAt: stats?.updatedAt
  };
}
