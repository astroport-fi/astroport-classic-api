import { APIGatewayAuthorizerResultContext } from "aws-lambda";
import { captureException, flush, AWSLambda } from "@sentry/serverless";

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
});

interface ExceptionConfig {
  name?: string;
  message?: string;
}

/**
 * captures errors thrown by functions
 *
 * @param error The error thrown.
 * @param config Object with optional extra configuration.
 * @param config.name identifier of the error that will appear in Sentry besides error object name.
 * @param config.message extra information that will be added in error context.
 * @param flushTimeout Maximum time in ms sentry should wait to flush its event queue.
 */
export const captureFunctionException = async (
  error: Error,
  config?: ExceptionConfig,
  flushTimeout = 2000
): Promise<void> => {
  captureException(error, (scope) => {
    if (config?.name) {
      scope.setTransactionName(config?.name);
    }
    if (config?.message) {
      scope.setContext("message", { name: config?.message });
    }
    return scope;
  });
  await flush(flushTimeout);
};

/**
 * captures errors thrown that end lambda function execution.
 * captures function information, including cloudwatch log link,
 * lambda name and parameters. Sends the error to sentry.
 *
 * @param error The error thrown.
 * @param flushTimeout Maximum time in ms sentry should wait to flush its event queue.
 * @param context lambda context object
 */
export const captureLambdaException = async (
  error: Error,
  flushTimeout = 2000,
  context: APIGatewayAuthorizerResultContext
): Promise<void> => {
  captureException(error, (scope) => {
    //We add additional information needed to debug the error
    scope.setTransactionName(context?.functionName as string);
    scope.setTag("url", `awslambda:///${context.functionName}`);
    scope.setContext("environment", { name: process.env.NODE_ENV });

    scope.setContext("runtime", {
      name: "node",
      version: global.process.version,
    });

    scope.setContext("aws.lambda", {
      aws_request_id: context.awsRequestId,
      function_name: context.functionName,
      function_version: context.functionVersion,
      invoked_function_arn: context.invokedFunctionArn,
      "sys.argv": process.argv,
    });

    scope.setContext("aws.cloudwatch.logs", {
      log_group: context.logGroupName,
      log_stream: context.logStreamName,
      url: `https://console.aws.amazon.com/cloudwatch/home?region=${
        process.env.AWS_REGION
      }#logsV2:log-groups/log-group/${encodeURIComponent(
        context.logGroupName as string
      )}/log-events/${encodeURIComponent(context.logStreamName as string)}?filterPattern="${
        context.awsRequestId
      }"`,
    });
    return scope;
  });
  await flush(flushTimeout);
};
