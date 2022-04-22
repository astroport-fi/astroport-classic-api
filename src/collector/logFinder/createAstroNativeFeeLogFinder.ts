import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import { isNative } from "../../modules/terra";

import { XAstroFeeTransformed } from "../../types";
import { xAstroNativeFeeRule } from "./logRules";

export function createAstroNativeFeeLogFinder(): ReturningLogFinderMapper<
  XAstroFeeTransformed | undefined
> {
  return createReturningLogFinder(xAstroNativeFeeRule(), (_, match) => {
    const token = match[0].value;
    const amount = match[6].value;

    // // filter out cw20 token fees
    if (!isNative(token)) {
      return undefined;
    }

    const transformed = {
      token: token,
      amount: Number(amount),
    };
    return transformed;
  });
}
