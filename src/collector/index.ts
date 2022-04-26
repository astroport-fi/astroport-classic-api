import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { heightCollect } from "./heightCollect";
import { chainCollect } from "./chainCollect";
import { supplyCollect } from "./supplyCollect";
import { poolCollect } from "./poolCollect";
import { getPairs } from "../services";
import { pairListToMap, priceListToMap } from "./helpers";
import { priceCollectV2 } from "./priceIndexer/priceCollectV2";
import { externalPriceCollect } from "./externalPriceCollect";
import { getPrices } from "../services/priceV2.service";

import { lambdaHandlerWrapper } from "../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (_: APIGatewayProxyEvent, context: APIGatewayAuthorizerResultContext): Promise<void> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const pairs = await getPairs();
    const pairMap = pairListToMap(pairs);

    const prices = await getPrices();
    const priceMap = priceListToMap(prices);

    const start = new Date().getTime();

    console.log("Indexing height...");
    await heightCollect();

    console.log("Indexing prices v2...");
    await priceCollectV2(pairs);

    console.log("Fetching external prices...");
    await externalPriceCollect();

    console.log("Indexing supply_timeseries...");
    await supplyCollect();

    console.log("Indexing pool_timeseries...");
    await poolCollect();

    // blocks, pairs, tokens, pool_volume
    console.log("Indexing chain...");
    await chainCollect(pairMap, priceMap);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  { errorMessage: "Error while running indexer: ", successMessage: "collected" }
);
