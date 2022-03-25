import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import { TxHistoryTransformed, XAstroFeeTransformed } from "../../types";
import { swapRule, xAstroCW20FeeRule } from "./logRules";
import { Pair } from "../../types";

export function createAstroCW20FeeLogFinder(): ReturningLogFinderMapper<
  XAstroFeeTransformed | undefined
> {
  return createReturningLogFinder(xAstroCW20FeeRule(), (_, match) => {
    const token = match[0].value;
    const amount = match[4].value;

    const transformed = {
      token: token,
      amount: Number(amount),
    };
    return transformed;
  });
}
