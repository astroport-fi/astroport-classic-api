import { AstroportStat } from "../models/astroport_stats.model";

export async function getStats(): Promise<any[]> {
  const stats = await AstroportStat.findOne();
  return stats;
}
