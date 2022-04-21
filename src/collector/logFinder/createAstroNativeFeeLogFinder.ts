import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import { XAstroFeeTransformed } from "../../types";
import { xAstroNativeFeeRule } from "./logRules";

export function createAstroNativeFeeLogFinder(): ReturningLogFinderMapper<
  XAstroFeeTransformed | undefined
> {
  return createReturningLogFinder(xAstroNativeFeeRule(), (_, match) => {
    //amount returns value: '9176uusd'
    const amount = match[4].value;
    //parses the amount it to 9176
    const parsedAmount = parseInt(amount);
    //turns '9176uusd' to [ '', 'uusd' ]
    const token = amount.split("" + parsedAmount)[1];

    const transformed = {
      token,
      amount: parsedAmount,
    };
    return transformed;
  });
}
