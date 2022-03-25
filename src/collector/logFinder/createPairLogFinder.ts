import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";

import * as logRules from "./logRules";

export function createPairLogFinders(factoryAddress: string): ReturningLogFinderMapper<{
  token1: string;
  token2: string;
  contractAddr: string;
  liquidityToken: string;
}> {
  return createReturningLogFinder(logRules.createPairRule(factoryAddress), (_, match) => {
    return {
      token1: match[2].value.split("-")[0],
      token2: match[2].value.split("-")[1],
      contractAddr: match[3].value,
      liquidityToken: match[4].value,
    };
  });
}
