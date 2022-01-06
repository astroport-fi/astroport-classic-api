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
    // await heightCollect();
    // await dailyCollect();
    await supplyCollect();
    await chainCollect();
  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: 'collected',
  };
}
