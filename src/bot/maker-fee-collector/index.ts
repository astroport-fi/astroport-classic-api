import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../../lib/terra";
import { swap } from "./feeSwap";
import constants from "../../environment/constants";

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

  await initHive(constants.TERRA_HIVE_ENDPOINT);
  await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

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
