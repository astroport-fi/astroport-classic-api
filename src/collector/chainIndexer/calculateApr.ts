import { BLOCKS_PER_YEAR } from "../../constants";
import { DISTRIBUTION_SCHEDULES, Schedules } from "../../data/distributionSchedules";
// import { getDistributionSchedule } from "../../lib/terra";

interface CalculateApr {
  factoryContract: string;
  totalValueLocked: number;
  tokenPrice: number;
  decimals?: number;
  latestBlock: number;
}

const getSchedule = (schedules: Schedules | undefined, latestBlock: number) => {
  let index = null;
  if (!schedules) return null;

  for (const [i, item] of schedules.entries()) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [start, end, _, type] = item;

    if (type === "time") {
      const now = Math.floor(Number(new Date()) / 1000);
      if (now > start && now < end) {
        console.log("found");
        index = i;
        break;
      }
    } else if (latestBlock > start && latestBlock < end) {
      index = i;
      break;
    }
  }
  if (index === null) return null;
  return schedules[index];
};

/**
 *
 * @param factoryContract
 * @param totalValueLocked
 * @param tokenPrice
 * @param decimals
 * @param latestBlock
 */
export const calculateThirdPartyApr = ({
  factoryContract,
  totalValueLocked,
  tokenPrice,
  decimals = 6,
  latestBlock,
}: CalculateApr): number => {
  const schedules = DISTRIBUTION_SCHEDULES.get(factoryContract);
  const schedule = getSchedule(schedules, latestBlock);

  if (!schedule) return 0;

  const [start, end, totalEmmision, type] = schedule;
  const multiplyBy = type === "time" ? 31536000 : BLOCKS_PER_YEAR;
  const tokensPerTime = parseInt(totalEmmision) / (end - start);
  const totalTokensPerYear = (multiplyBy * tokensPerTime) / 10 ** decimals;

  return (totalTokensPerYear * tokenPrice) / totalValueLocked;
};
