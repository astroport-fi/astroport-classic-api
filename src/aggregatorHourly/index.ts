import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD } from "../constants";

import { getHistoricPrices30d, getPrices } from "../services/priceV2.service";
import { priceListToMap } from "../collector/helpers";
import { aggregateXAstroFees30d } from "./aggregateXAstroFees30d";
import { aggregateXAstroFees30dChange } from "./aggregateXAstroFees30dChange";
import { aggregateXAstroFees365d } from "./aggregateXAstroFees365d";
import { aggregateXAstroFeesMonthly } from "./aggregateXAstroFeesMonthly";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export async function run(
  _: APIGatewayProxyEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();
  await initHive(TERRA_HIVE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  const prices = await getPrices();
  const priceMap = priceListToMap(prices);

  const prices_30d = await getHistoricPrices30d();
  const priceMap_30d = priceListToMap(prices_30d);

  try {
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
  } catch (e) {
    throw new Error("Error while running aggregator: " + e);
  }

  return {
    statusCode: 200,
    body: "aggregated",
  };
}
