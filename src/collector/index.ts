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
import { poolCollect } from './poolCollect';
import { getPairs } from "../services";
import { pairListToMap } from "./helpers";
import { poolVolumeCollect } from "./poolVolumeCollect";
import { poolProtocolRewardsCollect } from "./poolProtocolRewardsCollect";
import { aggregatePool } from "./poolAggregate";
import { priceIndexer } from "./indexer/priceIndexer";
import { priceCollect } from "./priceCollect";
import { astroportStatsCollect } from "./astroportStatCollect";
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
    console.log("Indexing height...")
    await heightCollect();

    console.log("Indexing prices...")
    // await dailyCollect();
    await priceCollect(pairs);

    console.log("Indexing prices v2...")
    await priceCollectV2();

    console.log("Indexing supply_timeseries...")
    await supplyCollect();

    console.log("Indexing pool_timeseries...")
    await poolCollect();

    console.log("Indexing pool_volume_24h...")
    await poolVolumeCollect();

    console.log("Indexing pool_protocol_rewards_24h...")
    await poolProtocolRewardsCollect();

    console.log("Aggregating pool timeseries -> pool...")
    await aggregatePool();

    console.log("Aggregating astroport global stats...")
    await astroportStatsCollect()

    // blocks, pairs, tokens, pool_volume
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
