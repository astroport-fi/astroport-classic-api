import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../../lib/terra";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD } from "../../constants";
import { swap } from "./feeSwap";

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

  await initHive(TERRA_HIVE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  try {
    const start = new Date().getTime();

    console.log("Swapping maker fees...");
    await swap();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    throw new Error("Error while swapping maker fees: " + e);
  }

  return {
    statusCode: 200,
    body: "swapped",
  };
}
