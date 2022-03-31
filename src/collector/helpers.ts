import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { TERRA_CHAIN_ID, TOKENS_WITH_8_DIGITS } from "../constants";
import { getHeightByDate } from "../services";
import { Pair } from "../types";
import { Proposal } from "../models/proposal.model";
import { PriceV2 } from "../types/priceV2.type";

dayjs.extend(utc);

const chainId = TERRA_CHAIN_ID;

export async function getHeightsFromDate(
  date: string,
  interval: string
): Promise<string[] | undefined> {
  const lastHeightInDate = dayjs(date);

  if (chainId == null) {
    return;
  }

  const heights = [];

  for (let i = 1; i <= 10; i++) {
    const height = await getHeightByDate(chainId, lastHeightInDate.add(i, interval).toISOString());

    if (height == null) {
      continue;
    }

    heights.push(height.value);
  }

  return Promise.all(heights);
}

export function pairListToMap(pairList: Pair[]): Map<string, Pair> {
  return pairList.reduce((mapAcc, obj) => {
    mapAcc.set(obj.contractAddr, obj);
    return mapAcc;
  }, new Map());
}

export function priceListToMap(priceList: PriceV2[]): Map<string, PriceV2> {
  return priceList.reduce((mapAcc, obj) => {
    mapAcc.set(obj.token_address, obj);
    return mapAcc;
  }, new Map());
}

// transform model proposal into map of proposal_id -> object
export function proposalListToMap(proposalList: any[]): Map<number, any> {
  return proposalList.reduce((mapAcc, obj) => {
    mapAcc.set(obj.proposal_id, obj);
    return mapAcc;
  }, new Map());
}

/**
 * For a swap - return the corresponding UST volume of the swap.
 * Certain pairs are disjoint with the rest of astroport, and need external price
 * data for this function to work.
 *
 * @param transformed
 * @param priceMap
 */

export function getUSTSwapValue(transformed: any, priceMap: Map<string, PriceV2>): number {
  // supported token addresses for calculating volume
  const whitelisted = new Set(priceMap.keys());

  let denom,
    amount = 0;
  if (whitelisted.has(transformed.assets[0].token)) {
    denom = transformed.assets[0].token;
    amount = Math.abs(transformed.assets[0].amount);
  } else if (whitelisted.has(transformed.assets[1].token)) {
    denom = transformed.assets[1].token;
    amount = Math.abs(transformed.assets[1].amount);
  } else {
    console.log(
      "Swap not supported from " +
        transformed.assets[0].token +
        " to " +
        transformed.assets[1].token
    );
  }

  const price_ust = priceMap.get(denom)?.price_ust as number;

  let result = (price_ust * amount) / 1000000;

  if (TOKENS_WITH_8_DIGITS.has(denom)) {
    result /= 100;
  }

  return result;
}
