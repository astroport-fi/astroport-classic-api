import bluebird from "bluebird";

import { getHistoricPrices30d, getPrices } from "../services/priceV2.service";
import { priceListToMap } from "../collector/helpers";
import { aggregateXAstroFees30d } from "./aggregateXAstroFees30d";
import { aggregateXAstroFees30dChange } from "./aggregateXAstroFees30dChange";
import { aggregateXAstroFees365d } from "./aggregateXAstroFees365d";
import { aggregateXAstroFeesMonthly } from "./aggregateXAstroFeesMonthly";

import { lambdaHandlerWrapper } from "../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const prices = await getPrices();
    const priceMap = priceListToMap(prices);

    const prices_30d = await getHistoricPrices30d();
    const priceMap_30d = priceListToMap(prices_30d);

    console.log("Running hourly aggregator...");

    console.log("Aggregating 30d xAstro fees...");
    await aggregateXAstroFees30d(priceMap);

    console.log("Aggregating 30d xAstro fees change...");
    await aggregateXAstroFees30dChange(priceMap_30d);

    console.log("Aggregating 365d xAstro fees...");
    await aggregateXAstroFees365d(priceMap);

    console.log("Aggregating monthly xAstro fees...");
    await aggregateXAstroFeesMonthly(priceMap);

    console.log("Done aggregating");
  },
  {
    successMessage: "aggregated",
    errorMessage: "Error while running hourly aggregator: ",
  }
);
