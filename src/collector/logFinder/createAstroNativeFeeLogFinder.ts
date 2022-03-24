import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import { XAstroFeeTransformed } from "../../types";
import { xAstroNativeFeeRule } from "./logRules";

export function createAstroNativeFeeLogFinder(): ReturningLogFinderMapper<
  XAstroFeeTransformed | undefined
> {
  return createReturningLogFinder(xAstroNativeFeeRule(), (_, match) => {
    const token = match[0].value;
    const amount = match[6].value;

    const transformed = {
      token: token,
      amount: Number(amount),
    };
    return transformed;
  });
}
