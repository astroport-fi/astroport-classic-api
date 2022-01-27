import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { TERRA_CHAIN_ID } from '../constants';
import { getHeightByDate } from '../services';
import { Pair } from "../types";
import { getPsiExchangeRate } from "../lib/terra";

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
 * Only works with UST, Luna, Psi base pairs.
 *
 * TODO would like to rewrite this to pull price data from DB
 * @param transformed
 * @param lunaExchangeRate
 * @param psiExchangeRate
 */

// supported token addresses for calculating volume
const whitelisted = new Set<string>(['uusd', 'uluna', 'terra12897djskt9rge8dtmm86w654g7kzckkd698608'])


export function getUSTSwapValue(transformed: any, lunaExchangeRate: number, psiExchangeRate: number): number {
  // try for native tokens



  let denom, amount = 0
  if(whitelisted.has(transformed.assets[0].token)) {
    denom = transformed.assets[0].token
    amount = Math.abs(transformed.assets[0].amount)
  } else if (whitelisted.has(transformed.assets[1].token)) {
    denom = transformed.assets[1].token
    amount = Math.abs(transformed.assets[1].amount)
  } else {
    console.log("Swap not supported from " + transformed.assets[0].token + " to " + transformed.assets[1].token)
  }



  switch(denom) {
    case "uusd": {
      return amount / 1000000;
    }
    case "uluna": {
      return lunaExchangeRate * amount / 1000000;
    }
    case "terra12897djskt9rge8dtmm86w654g7kzckkd698608": { // psi
      return psiExchangeRate * amount / 1000000;
    }
    default: {
      console.log("Unable to find UST value of " + denom)
      break;
    }
  }
  return 0
}