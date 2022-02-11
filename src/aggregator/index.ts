import bluebird from 'bluebird';
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayAuthorizerResultContext,
} from 'aws-lambda';

import { initHive, initMantle, initLCD } from '../lib/terra';
import { connectToDatabase } from '../modules/db';
import { TERRA_MANTLE, TERRA_CHAIN_ID, TERRA_LCD, TERRA_HIVE } from "../constants";

import { aggregatePoolVolume } from "../collector/aggregatePoolVolume";
import { aggregatePoolProtocolRewards } from "../collector/aggregatePoolProtocolRewards";
import { aggregatePool } from "../collector/poolAggregate";
import { astroportStatsCollect } from "../collector/astroportStatCollect";

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

  try {
    console.log("Aggregating pool_volume_24h...")
    await aggregatePoolVolume();

    console.log("Aggregating pool timeseries -> pool...")
    await aggregatePool();

    console.log("Aggregating pool_protocol_rewards_24h...")
    await aggregatePoolProtocolRewards();

    console.log("Aggregating astroport global stats...")
    await astroportStatsCollect()

  } catch (e) {
    throw new Error("Error while running aggregator: " + e);
  }

  return {
    statusCode: 200,
    body: 'aggregated',
  };
}
