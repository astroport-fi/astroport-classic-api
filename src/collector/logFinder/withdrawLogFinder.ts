import { createReturningLogFinder, ReturningLogFinderMapper } from '@terra-money/log-finder'
import { ProtocolTokenTransferTransformed } from "../../types";
import { generatorProxyClaimRule } from "./logRules";


/**
 * When a user provides or withdraws LP tokens to a pool, the protocol factory contract sends
 * back their native tokens as rewards to the proxy contract (not necessarily for the LP provider).
 *
 * This log finder extracts and returns these transactions.
 */
export function createWithdrawLogFinder(
  generatorProxyContracts: Map<string, any>,
  token: string,
  proxy: string,
  factory: string
): ReturningLogFinderMapper<ProtocolTokenTransferTransformed | undefined > {

  return createReturningLogFinder(generatorProxyClaimRule(token, proxy, factory), (_, match) => {
    if (generatorProxyContracts.has(match[3].value)) {
      // just find transactions where the protocol token is sent to the generator proxy address
      const token = match[0].value
      const action = match[1].value
      const from = match[2].value
      const to = match[3].value
      const amount = match[4].value

      const transformed = {
        token: token,
        pool: generatorProxyContracts.get(to) as string,
        amount: parseInt(amount)
      }

      return transformed
    }
    return
  })
}
