import { createReturningLogFinder, ReturningLogFinderMapper } from '@terra-money/log-finder'
import { TxHistoryTransformed } from '../../types/transformed'
import { swapRule } from "./logRules";
import { Pair } from "../../types";


export function createSwapFinder(
  pairMap: Map<string, Pair>
): ReturningLogFinderMapper<TxHistoryTransformed | undefined > {
  return createReturningLogFinder(swapRule(), (_, match) => {
    if (pairMap.has(match[0].value)) {
      const action = match[1].value
      const assets = [
        {
          token: '',
          amount: '',
        },
        {
          token: '',
          amount: '',
        },
      ]
      if (action === 'swap') {
        assets[0].token = match[4].value
        assets[0].amount = match[6].value
        assets[1].token = match[5].value
        assets[1].amount = '-' + match[7].value
      }
      const transformed = {
        pair: match[0].value,
        action: match[1].value,
        assets,
      }
      return transformed
    }
    return
  })
}
