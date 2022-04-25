import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { getPairs } from "../services";
import { priceCollectV230d } from "./priceIndexer/priceCollectV2_30d";
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

  try {
    const start = new Date().getTime();

    console.log("Running hourly collector...");

    console.log("Indexing prices v2 (30d)...");
    await priceCollectV230d(pairs);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: "collected",
  };
}
