import bluebird from "bluebird";
import { APIGatewayAuthorizerResultContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { initHive, initLCD, initMantle } from "../../lib/terra";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD, TERRA_MANTLE } from "../../constants";
import { swap } from "./makerFees";
import { connectToDatabase } from "../../modules/db";
import { getPairs } from "../../services";
import { getPrices } from "../../services/priceV2.service";
import { pairListToMap } from "../../collector/helpers";

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
  await initMantle(TERRA_MANTLE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  try {

    const start = new Date().getTime()

    console.log("Swapping maker fees...")
    await swap();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000)

  } catch (e) {
    throw new Error("Error while swapping maker fees: " + e);
  }

  return {
    statusCode: 200,
    body: 'swapped',
  };
}
