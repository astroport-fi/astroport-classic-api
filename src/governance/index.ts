import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive } from "../lib/terra";
import { connectToDatabase } from "../modules/db";
import { governanceProposalCollect } from "./governanceProposalCollect";
import constants from "../environment/constants";

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
  await initHive(constants.TERRA_HIVE_ENDPOINT);

  try {
    const start = new Date().getTime();

    console.log("Checking for new governance proposals...");
    await governanceProposalCollect();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    throw new Error("Error while running governance indexer: " + e);
  }

  return {
    statusCode: 200,
    body: "collected",
  };
}
