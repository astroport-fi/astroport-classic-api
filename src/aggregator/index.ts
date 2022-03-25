import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD, initMantle } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD, TERRA_MANTLE } from "../constants";

import { aggregatePoolVolume } from "./aggregatePoolVolume";
import { aggregatePoolProtocolRewards } from "./aggregatePoolProtocolRewards";
import { aggregatePool } from "./poolAggregate";
import { astroportStatsCollect } from "./astroportStatCollect";
import { poolVolume7dCollect } from "./poolVolume7dCollect";
import { getPairs } from "../services";
import { aggregatePoolProtocolRewards7d } from "./aggregatePoolProtocolRewards7d";
import { getPrices } from "../services/priceV2.service";
import { priceListToMap } from "../collector/helpers";
import { aggregateXAstroFees } from "./aggregateXAstroFees";
import { aggregateVotes } from "./aggregateVotes";

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
  await initMantle(TERRA_MANTLE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  const pairs = await getPairs();

  const prices = await getPrices();
  const priceMap = priceListToMap(prices);

  try {
    console.log("Aggregating pool_volume_24h...");
    await aggregatePoolVolume();

    console.log("Aggregating pool_volume_7d...");
    await poolVolume7dCollect(pairs);

    console.log("Aggregating pool timeseries -> pool...");
    await aggregatePool();

    console.log("Aggregating pool_protocol_rewards_24h...");
    await aggregatePoolProtocolRewards();

    console.log("Aggregating pool_protocol_rewards_7d...");
    await aggregatePoolProtocolRewards7d();

    console.log("Aggregating astroport global stats...");
    await astroportStatsCollect();

    console.log("Aggregating xAstro fees...");
    await aggregateXAstroFees(priceMap);

    console.log("Aggregating vote counts...");
    await aggregateVotes();

    console.log("Done aggregating");
  } catch (e) {
    throw new Error("Error while running aggregator: " + e);
  }

  return {
    statusCode: 200,
    body: "aggregated",
  };
}
