import bluebird from "bluebird";
import { APIGatewayAuthorizerResultContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { initHive, initLCD, initMantle } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD, TERRA_MANTLE } from "../constants";
import { governanceProposalCollect } from "./governanceProposalCollect";


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

    const start = new Date().getTime()

    console.log("Checking for new governance proposals...")
    await governanceProposalCollect();


    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000)

  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: 'collected',
  };
}
