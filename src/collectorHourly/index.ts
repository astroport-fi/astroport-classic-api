import bluebird from "bluebird";

import { getPairs } from "../services";
import { priceCollectV230d } from "./priceIndexer/priceCollectV2_30d";
import { lambdaHandlerWrapper } from "../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(async (): Promise<void> => {
  // get pairs
  // map contract_address -> pair
  const pairs = await getPairs();

  const start = new Date().getTime();

  console.log("Running hourly collector...");

  console.log("Indexing prices v2 (30d)...");
  await priceCollectV230d(pairs);

  console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
});
