import bluebird from 'bluebird';
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayAuthorizerResultContext,
} from 'aws-lambda';

import { initHive, initMantle, initLCD } from '../lib/terra';
import { connectToDatabase } from '../modules/db';
import { TERRA_MANTLE, TERRA_CHAIN_ID, TERRA_LCD, TERRA_HIVE } from "../constants";
import { heightCollect } from './heightCollect';
import { chainCollect } from './chainCollect';
import { supplyCollect } from './supplyCollect';
import { poolCollect } from './poolCollect';
import { getPairs } from "../services";
import { pairListToMap } from "./helpers";
import { priceCollect } from "./priceCollect";
import { priceCollectV2 } from "./priceCollectV2";

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

    const start = new Date().getTime()

    console.log("Indexing height...")
    await heightCollect();

    console.log("Indexing prices...")
    await priceCollect(pairs); // TODO deprecate

    console.log("Indexing prices v2...")
    await priceCollectV2();

    console.log("Indexing supply_timeseries...")
    await supplyCollect();

    console.log("Indexing pool_timeseries...")
    await poolCollect();

    // blocks, pairs, tokens, pool_volume
    console.log("Indexing chain...")
    await chainCollect(pairMap);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000)

  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: 'collected',
  };
}
