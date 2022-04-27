import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { initHive, initLCD } from "../../lib/terra";
import { swap } from "./feeSwap";
import constants from "../../environment/constants";
import { lambdaHandlerWrapper } from "../../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const start = new Date().getTime();

    console.log("Swapping maker fees...");
    await swap();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  {
    errorMessage: "Error while swapping maker fees: ",
    successMessage: "swapped",
    initDatabaseConnection: false,
  }
);
