import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../lib/terra";
import { connectToDatabase, disconnectDatabase } from "../modules/db";
import { heightCollect } from "./heightCollect";
import { chainCollect } from "./chainCollect";
import { supplyCollect } from "./supplyCollect";
import { poolCollect } from "./poolCollect";
import { getPairs } from "../services";
import { pairListToMap, priceListToMap } from "./helpers";
import { priceCollectV2 } from "./priceIndexer/priceCollectV2";
import { externalPriceCollect } from "./externalPriceCollect";
import { getPrices } from "../services/priceV2.service";
import constants from "../environment/constants";

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
  await initHive(constants.TERRA_HIVE_ENDPOINT);

  await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

  // get pairs
  // map contract_address -> pair
  const pairs = await getPairs();
  const pairMap = pairListToMap(pairs);

  const prices = await getPrices();
  const priceMap = priceListToMap(prices);

  try {
    const start = new Date().getTime();

    console.log("NODE_ENV: " + process.env.NODE_ENV)
    console.log("chain_id: " + process.env.TERRA_CHAIN_ID)



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

    // blocks, pairs, tokens, pool_volume
    console.log("Indexing chain...");
    await chainCollect(pairMap, priceMap);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    await disconnectDatabase();
    throw new Error("Error while running indexer: " + e);
  }

  await disconnectDatabase();

  return {
    statusCode: 200,
    body: "collected",
  };
}
