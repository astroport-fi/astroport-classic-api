import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { TERRA_CHAIN_ID } from '../constants';
import { getHeightByDate } from '../services';

const chainId = TERRA_CHAIN_ID;

export async function getHeightsFromDate(
  date: string,
  interval: string
): Promise<string[] | undefined> {
  const lastHeightInDate = dayjs(date);

  if (chainId == null) {
    return;
  }

  let heights = [];

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
