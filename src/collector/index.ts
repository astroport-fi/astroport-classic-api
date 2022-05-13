import bluebird from "bluebird";

import { heightCollect } from "./heightCollect";
import { chainCollect } from "./chainCollect";
import { supplyCollect } from "./supplyCollect";
import { poolCollect } from "./poolCollect";
import { getPairs } from "../services";
import { pairListToMap, priceListToMap } from "./helpers";
import { priceCollectV2 } from "./priceIndexer/priceCollectV2";
import { externalPriceCollect } from "./externalPriceCollect";
import { getPrices } from "../services/priceV2.service";

import { lambdaHandlerWrapper } from "../lib/handler-wrapper";
import { chainCollectBatch } from "./chainCollectBatch";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const pairs = await getPairs();
    const pairMap = pairListToMap(pairs);

    const prices = await getPrices();
    const priceMap = priceListToMap(prices);

    const start = new Date().getTime();

    console.log("Indexing height...");
    await heightCollect();

    console.log("Indexing prices v2...");
    await priceCollectV2(pairs);

    console.log("Fetching external prices...");
    await externalPriceCollect();

    console.log("Indexing supply_timeseries...");
    await supplyCollect();

    console.log("Indexing pool_timeseries...");
    await poolCollect();

    // In development, we use batching
    // if (process.env.NODE_ENV === "development") {
    // blocks, pairs, tokens, pool_volume (in batches)

    // Temporarily use batching in chainCollect to catch up faster due to
    // really slow Hive nodes
    console.log("Indexing chain (batch)...");
    await chainCollectBatch(pairMap, priceMap);
    // } else {
    //   // blocks, pairs, tokens, pool_volume
    //   console.log("Indexing chain...");
    //   await chainCollect(pairMap, priceMap);
    // }

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  { errorMessage: "Error while running indexer: ", successMessage: "collected" }
);
