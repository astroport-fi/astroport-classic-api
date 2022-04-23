import { BigNumber } from "bignumber.js";

import constants from "../environment/constants";

BigNumber.config({
  DECIMAL_PLACES: constants.DECIMALS,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export function num(number: number | string): BigNumber {
  return new BigNumber(number);
}

export * from "bignumber.js";
