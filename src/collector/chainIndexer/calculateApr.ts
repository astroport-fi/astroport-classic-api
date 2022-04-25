// import { DISTRIBUTION_SCHEDULES, Schedules } from "../../data/distributionSchedules";
import constants from "../../environment/constants";
import { Schedules, ScheduleType } from "../../types/contracts";

interface CalculateApr {
  factoryContract?: string;
  schedules?: Schedules;
  totalValueLocked: number;
  tokenPrice: number;
  decimals?: number;
  latestBlock: number;
}

const getSchedule = (schedules: Schedules | undefined, latestBlock: number) => {
  let index = null;
  if (!schedules) return null;

  const type = schedules.type;
  for (const [i, item] of schedules.values.entries()) {
    const [start, end] = item;
    if (type === ScheduleType.UnixTime) {
      const now = Math.floor(Number(new Date()) / 1000);
      if (now > start && now < end) {
        index = i;
        break;
      }
    } else if (latestBlock > start && latestBlock < end) {
      index = i;
      break;
    }
  }
  if (index === null) return null;
  return schedules.values[index];
};

export const calculateThirdPartyApr = ({
  schedules,
  totalValueLocked,
  tokenPrice,
  decimals = 6,
  latestBlock,
}: CalculateApr): number => {
  const schedule = getSchedule(schedules, latestBlock);
  if (!schedule) return 0;
  const [start, end, totalEmission] = schedule;
  const multiplyBy =
    schedules?.type === ScheduleType.UnixTime
      ? constants.SECONDS_PER_YEAR
      : constants.BLOCKS_PER_YEAR;
  const tokensPerTime = parseInt(totalEmission) / (end - start);
  const totalTokensPerYear = (multiplyBy * tokensPerTime) / 10 ** decimals;
  return (totalTokensPerYear * tokenPrice) / totalValueLocked;
};
