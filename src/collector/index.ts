import bluebird from 'bluebird';
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayAuthorizerResultContext,
} from 'aws-lambda';

import { initHive, initMantle, initLCD } from '../lib/terra';
import { connectToDatabase } from '../modules/db';
import { TERRA_MANTLE, TERRA_CHAIN_ID, TERRA_LCD, TERRA_HIVE } from "../constants";
import { dailyCollect } from './dailyCollect';
import { heightCollect } from './heightCollect';
import { chainCollect } from './chainCollect';
import { supplyCollect } from './supplyCollect';
import { getPairs } from "../services";
import { pairListToMap } from "./helpers";

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

  // get pairs
  // map contract_address -> pair
  const pairs = await getPairs();
  const pairMap = pairListToMap(pairs);

  try {
    // height
    console.log("Indexing height...")
    await heightCollect();
    // prices
    console.log("Indexing prices...")
    await dailyCollect();
    // supply_timeseries
    console.log("Indexing supply...")
    await supplyCollect();
    // blocks, pairs, tokens, pool_volume, pool time_series
    console.log("Indexing chain...")
    await chainCollect(pairMap);
  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: 'collected',
  };
}
