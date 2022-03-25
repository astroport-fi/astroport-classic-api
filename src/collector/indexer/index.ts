import { getPairs } from "../../services";

import { priceIndexer } from "./priceIndexer";

export async function runIndexers(blockHeight: number): Promise<void> {
  const pairs = await getPairs();
  await priceIndexer(pairs, blockHeight);
}
