import bluebird from "bluebird";

import { aggregatePoolVolume } from "./aggregatePoolVolume";
import { aggregatePoolProtocolRewards } from "./aggregatePoolProtocolRewards";
import { aggregatePool } from "./poolAggregate";
import { astroportStatsCollect } from "./astroportStatCollect";
import { poolVolume7dCollect } from "./poolVolume7dCollect";
import { getPairs } from "../services";
import { aggregatePoolProtocolRewards7d } from "./aggregatePoolProtocolRewards7d";
import { getPrices } from "../services/priceV2.service";
import { priceListToMap } from "../collector/helpers";
import { aggregateXAstroFees } from "./aggregateXAstroFees";
import { aggregateVotes } from "./aggregateVotes";
import { aggregateXAstroFees7d } from "./aggregateXAstroFees7d";
import { getProxyAddressesInfo } from "../collector/proxyAddresses";
import { lambdaHandlerWrapper } from "../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const pairs = await getPairs();

    const prices = await getPrices();
    const priceMap = priceListToMap(prices);

    const generatorProxyContracts = await getProxyAddressesInfo();

    console.log("Aggregating pool_volume_24h...");
    await aggregatePoolVolume();

    console.log("Aggregating pool_volume_7d...");
    await poolVolume7dCollect(pairs);

    console.log("Aggregating pool timeseries -> pool...");
    await aggregatePool();

    console.log("Aggregating pool_protocol_rewards_24h...");
    await aggregatePoolProtocolRewards(generatorProxyContracts);

    console.log("Aggregating pool_protocol_rewards_7d...");
    await aggregatePoolProtocolRewards7d(generatorProxyContracts);

    console.log("Aggregating astroport global stats...");
    await astroportStatsCollect();

    console.log("Aggregating 24h xAstro fees...");
    await aggregateXAstroFees(priceMap);

    console.log("Aggregating 7d xAstro fees...");
    await aggregateXAstroFees7d(priceMap);

    console.log("Aggregating vote counts...");
    await aggregateVotes();

    console.log("Done aggregating");
  },
  {
    successMessage: "aggregated",
    errorMessage: "Error while running aggregator: ",
  }
);
