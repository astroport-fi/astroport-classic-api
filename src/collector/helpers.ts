import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { TERRA_CHAIN_ID } from '../constants';
import { getHeightByDate } from '../services';
import { Pair } from "../types";

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
    const height = await getHeightByDate(
      chainId,
      lastHeightInDate.add(i, interval).toISOString()
    );

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

/**
 * For a swap - return the corresponding UST volume of the swap.
 * Only works with UST or Luna base pairs.
 *
 * TODO would like to rewrite this to pull price data from DB
 * @param transformed
 * @param lunaExchangeRate
 * @param pairMap
 */
export function getUSTSwapValue(transformed: any, lunaExchangeRate: number): number {
  let denom = transformed.assets[0].token;
  let amount = Math.abs(transformed.assets[0].amount);
  if(transformed.assets[0].token.startsWith("terra")) {
    denom = transformed.assets[1].token
    amount = Math.abs(transformed.assets[1].amount)
  }
  switch(denom) {
    case "uusd": {
      return amount / 1000000;
    }
    case "uluna": {
      return lunaExchangeRate * amount / 1000000;
    }
    default: {
      console.log("Unable to find UST value of " + denom)
      break;
    }
  }
  return 0
}