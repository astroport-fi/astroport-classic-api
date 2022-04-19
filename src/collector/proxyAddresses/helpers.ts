/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Schedules, ScheduleType } from "../../types/contracts";

/**
 * Figures out what the distribution schedule is, can be block or unix time
 *
 * @param schedules token emission schedules
 * @returns schedule type string as "block" or "unix"
 */
export const generateScheduleType = (schedules: Schedules["values"] = []): ScheduleType => {
  let type = ScheduleType.Block;
  const currentYear = new Date().getFullYear();

  for (const schedule of schedules) {
    // use end time as some values have starttime of 0;
    const endTime = schedule[1] || 0;
    // if value is not milliseconds, multiply by 1000 to turn it to milliseconds
    // this way we can check year to see if value is a date
    const time = endTime / 10 ** 12 > 1 ? endTime : endTime * 1000;
    const year = new Date(time).getFullYear();
    // if year is inbetween last 5 years and next 10 years then value is time
    if (year > currentYear - 5 && year < currentYear + 10) {
      type = ScheduleType.UnixTime;
    }
  }
  return type;
};

/**
 * Formats contract emission schedules to a standardized format
 *
 * @param distributionSchedule token emission schedules from staking contract
 * @param rewardConfig configuration from contract query
 * @returns schedules in format [[number, number, string]]
 */
export const formatSchedules = (
  distributionSchedule: any[] | undefined,
  rewardConfig: { mars_token?: string; mirror_token?: string }
): Schedules["values"] => {
  let schedule = [];
  //temporary for contracts with no clear distribution schedule to be fetched in one query
  if (!distributionSchedule) {
    //TODO temporary values for mars token
    if (rewardConfig?.mars_token) {
      schedule = [[1646650800, 1678186800, "10000000000000"]];
      //TODO temporary values for mirror token
    } else if (Object.keys(rewardConfig).includes("mirror_token")) {
      schedule = [
        [21600, 31557600, "20587500000000"],
        [31557600, 63093600, "10293700000000"],
        [63093600, 94629600, "5146800000000"],
        [94629600, 126165600, "2573400000000"],
      ];
    } else {
      console.log("Distribution schedule not found");
    }
  } else {
    const singleSchedule = distributionSchedule.find(() => true);
    // different scenarios on how distribution schedules are formated, extend incase a variation
    if (Array.isArray(singleSchedule)) {
      schedule = distributionSchedule;
    } else if (singleSchedule?.start_time) {
      schedule = distributionSchedule.map((i) => [i.start_time, i.end_time, i.amount]);
    } else if (typeof singleSchedule === "number") {
      schedule = [distributionSchedule];
    } else {
      console.log("Can not match distribution schedule");
    }
  }
  return schedule;
};
