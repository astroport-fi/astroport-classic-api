import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import constants from "../environment/constants";
import { connectToDatabase, disconnectDatabase } from "../modules/db";
import { initHive, initLCD } from "./terra";
import { captureException, setContext, flush, AWSLambda } from "@sentry/serverless";

import { captureLambdaException } from "./error-handlers";
interface Parameters {
  errorMessage?: string;
  successMessage?: string;
  initDatabaseConnection?: boolean;
  disconnectDbWhenFinished?: boolean;
  disconnectDbWhenError?: boolean;
}

/**
 * This is the main wrapper for lambda functions.
 * Handling errors, connecting to services needed.
 * We want to have dry code in the main lambdas and avoid repetition with
 * init connections, and similar try catch blocks.
 *
 *
 * @param handler The main lambda function being wrapped, can optionally receive event and context from wrapper.
 *
 * @param parameters an optional object for granular configuration
 * @param {string} [parameters.successMessage = "Error while running indexer: "] message displayed when lambda finalizes execution.
 * @param {string} [parameters.errorMessage = "collected"] message displayed when lambda finalizes execution.
 * @param {boolean} [parameters.initDatabaseConnection = true] some lambdas not using database connection can pass this as false, which will disable
 * disconnection as well, when this is passed, disconnect parameters are not required.
 * @param {boolean} [parameters.disconnectDbWhenError = true]
 * @param {boolean} [parameters.disconnectDbWhenFinished = true]
 *
 * @returns a wrapped version of lambda handler with error handling and initial connections
 */
export const lambdaHandlerWrapper =
  (
    handler: (
      event: APIGatewayProxyEvent,
      context: APIGatewayAuthorizerResultContext
    ) => Promise<void>,
    parameters?: Parameters
  ) =>
  async (
    event: APIGatewayProxyEvent,
    context: APIGatewayAuthorizerResultContext
  ): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;

    const {
      errorMessage = "Error while running indexer: ",
      successMessage = "collected",
      disconnectDbWhenError = true,
      disconnectDbWhenFinished = true,
      initDatabaseConnection = true,
    } = parameters ?? {};

    if (initDatabaseConnection) {
      await connectToDatabase();
    }

    await initHive(constants.TERRA_HIVE_ENDPOINT);
    await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

    try {
      //Main handler content
      await handler(event, context);
    } catch (err) {
      if (initDatabaseConnection && disconnectDbWhenError) {
        await disconnectDatabase();
      }
      await captureLambdaException(err, 200, context);
      throw new Error(errorMessage + err);
    }

    if (initDatabaseConnection && disconnectDbWhenFinished) {
      await disconnectDatabase();
    }

    return {
      statusCode: 200,
      body: successMessage || "",
    };
  };
