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

export async function pairListToMap(pairList: Pair[]): Promise<Map<string, Pair>> {
  return pairList.reduce((mapAcc, obj) => {
    mapAcc.set(obj.contractAddr, obj);
    return mapAcc;
  }, new Map());
}
