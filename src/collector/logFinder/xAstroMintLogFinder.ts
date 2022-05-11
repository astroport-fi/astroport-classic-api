import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import constants from "../../environment/constants";
import { XAstroMintTransformed } from "../../types";
import { xAstroMintRule } from "./logRules";

export function xAstroMintLogFinder(): ReturningLogFinderMapper<XAstroMintTransformed | undefined> {
  return createReturningLogFinder(xAstroMintRule(constants.XASTRO_TOKEN), (_, match) => {
    const to = match[2].value;
    const amount = match[3].value;

    const transformed = {
      to: to,
      amount: Number(amount),
    };
    return transformed;
  });
}
