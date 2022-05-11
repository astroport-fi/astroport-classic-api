import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import constants from "../../environment/constants";
import { vxAstroCreateLockTransformed } from "../../types";
import { vxAstroCreateLockRule } from "./logRules";

export function vxAstroCreateLockLogFinder(): ReturningLogFinderMapper<
  vxAstroCreateLockTransformed | undefined
> {
  return createReturningLogFinder(vxAstroCreateLockRule(constants.VXASTRO_TOKEN), (_, match) => {
    const from = match[0].value;
    const to = match[1].value;
    const amount = match[2].value;

    const transformed = {
      to: to,
      amount: Number(amount),
      from: from,
    };
    return transformed;
  });
}
