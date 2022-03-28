import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { connectToDatabase } from "../../modules/db";
import { snapshot } from "./snapshot";

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

  await connectToDatabase()

  try {
    const start = new Date().getTime();

    console.log("Collecting a snapshot of all stats...")
    await snapshot()

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    throw new Error("Error while swapping maker fees: " + e);
  }

  return {
    statusCode: 200,
    body: "Archived",
  };
}
