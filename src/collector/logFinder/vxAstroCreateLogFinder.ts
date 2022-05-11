import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";
import constants from "../../environment/constants";
import { vxAstroCreateLockTransformed } from "../../types";
import { vxAstroCreateLockRule } from "./logRules";

/**
 * When a user locks up their xAstro, a create_lock event is created with
 * information about the user that took the action.
 *
 * This log finder extracts those interactions
 */
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
