import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import constants from "../environment/constants";
import { connectToDatabase, disconnectDatabase } from "../modules/db";
import { initHive, initLCD } from "./terra";

interface Messages {
  errorMessage?: string;
  successMessage?: string;
}

/**
 * This is the main wrapper for lambda functions.
 * Handling errors, connecting to services needed.
 * We want to have dry code in the main lambdas and avoid repetition with
 * init connections, and similar try catch blocks.
 *
 *
 * @param handler The full lambda handler being wrapped
 * @param messages {errorMessage , successMessage} are optional parameters for handling error and success
 * @returns a wrapped version of lambda handler with error handling and initial connections
 */
export const lambdaHandlerWrapper =
  (
    handler: (
      event: APIGatewayProxyEvent,
      context: APIGatewayAuthorizerResultContext
    ) => Promise<APIGatewayProxyResult>,
    messages?: Messages
  ) =>
  async (
    event: APIGatewayProxyEvent,
    context: APIGatewayAuthorizerResultContext
  ): Promise<APIGatewayProxyResult> => {
    await connectToDatabase();
    await initHive(constants.TERRA_HIVE_ENDPOINT);
    await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

    const { errorMessage, successMessage } = messages ?? {
      errorMessage: "Error while running indexer: ",
      successMessage: "collected",
    };

    try {
      await handler(event, context);
    } catch (err) {
      await disconnectDatabase();
      //TODO use a better error logging service?
      throw new Error(errorMessage + err);
    }

    await disconnectDatabase();

    return {
      statusCode: 200,
      body: successMessage || "",
    };
  };

//Can be used for APIGW Responses
// export const buildResponse = (
//   statusCode: number,
//   body: PlainObject
// ): {
//   statusCode: number;
//   headers: PlainObject;
//   body: string;
// } => ({
//   statusCode,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(body),
// });
