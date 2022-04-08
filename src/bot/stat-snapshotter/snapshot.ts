import { Pool } from "../../models/pool.model";
import { AstroportStat } from "../../models/astroport_stats.model";
import { xAstroFeeStat } from "../../models/xastro_fee_stat.model";
import { PriceV2 } from "../../models/price_v2.model";
import { Snapshot } from "../../models/snapshot.model.ts";
import { getBlock, getPools, getSupply } from "../../services";
import { TERRA_CHAIN_ID } from "../../constants";

export async function snapshot(): Promise<void> {

  // get all info
  const height = await getBlock(TERRA_CHAIN_ID);
  const pool = await getPools({});
  const stat = await AstroportStat.find();
  const price = await PriceV2.find();
  const xastro = await xAstroFeeStat.find();
  const supply = await getSupply();

  await Snapshot.create({
    block: height.hiveHeight,
    pool: pool,
    stat: stat,
    price: price,
    xastro: xastro,
    supply: supply,
  });
}
