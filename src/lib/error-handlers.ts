import { APIGatewayAuthorizerResultContext } from "aws-lambda";
import { captureException, flush, AWSLambda } from "@sentry/serverless";

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

interface ExceptionConfig {
  name?: string;
  message?: string;
}

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

export const captureLambdaException = async (
  error: Error,
  flushTimeout = 2000,
  context: APIGatewayAuthorizerResultContext
): Promise<void> => {
  captureException(error, (scope) => {
    scope.setTransactionName(context?.functionName as string);

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
