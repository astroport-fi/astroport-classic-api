import { StakingContract, ScheduleType } from "../types/contracts";

/**
 * most schedules have blocks, in the case we g
 * ad as the forth entry to schedule array
 * can be and array of [block, block, total] or total]
 */

export type Schedules = {
  type: ScheduleType;
  values: [number, number, string][];
};

export const DISTRIBUTION_SCHEDULES = new Map<string, Schedules>([
  [
    StakingContract.ANC_UST,
    {
      type: ScheduleType.UnixTime,
      values: [
        [1641805200, 1642410000, "1160000000000"],
        [1642410000, 1643014800, "1160000000000"],
        [1643014800, 1643619600, "1160000000000"],
        [1643619600, 1644224400, "1160000000000"],
        [1644224400, 1644829200, "1160000000000"],
        [1644829200, 1645434000, "1160000000000"],
        [1645434000, 1646038800, "1160000000000"],
        [1646038800, 1646643600, "1160000000000"],
        [1646643600, 1647248400, "1160000000000"],
        [1647248400, 1647504459, "540000000000"],
      ],
    },
  ],
  [
    StakingContract.APOLLO_UST,
    {
      type: ScheduleType.Block,
      values: [[0, 94608000, "16400000000000"]],
    },
  ],
  [
    StakingContract.MIR_UST,
    {
      type: ScheduleType.Block,
      values: [
        [21600, 31557600, "20587500000000"],
        [31557600, 63093600, "10293700000000"],
        [63093600, 94629600, "5146800000000"],
        [94629600, 126165600, "2573400000000"],
      ],
    },
  ],
  [
    StakingContract.ORION_UST,
    {
      type: ScheduleType.UnixTime,
      values: [[1647446401, 1650038400, "15000000000000"]],
    },
  ],
  [
    StakingContract.VKR_UST,
    {
      type: ScheduleType.Block,
      values: [
        [6018800, 6850000, "19753544179118"],
        [6850000, 9546010, "44868612000000"],
        [9546010, 14202820, "30000000000000"],
        [14202820, 18859630, "15000000000000"],
        [18859630, 23516440, "7500000000000"],
      ],
    },
  ],
  [
    StakingContract.STT_UST,
    {
      type: ScheduleType.UnixTime,
      values: [
        [1641503211, 1642104349, "1906196"],
        [1642104349, 1642104361, "0"],
        [1642104361, 1642106215, "21334525"],
        [1642106215, 1642106227, "0"],
        [1642106227, 1642107646, "163413840"],
        [1642107646, 1642107679, "0"],
        [1642107679, 1642156043, "557298776"],
        [1642156043, 1642156056, "0"],
        [1642156056, 1642159705, "429015798"],
        [1642159705, 1642159724, "0"],
        [1642159724, 1642160338, "144599634"],
        [1642160338, 1642160358, "0"],
        [1642160358, 1644485772, "704302750834"],
        [1644485772, 1644485797, "0"],
        [1644485797, 1646092800, "427328441950"],
        [1646092800, 1648672162, "426481812169"],
        [1648672162, 1648672181, "0"],
        [1648672181, 1651363199, "444997000000"],
        [1651363199, 1654041599, "400000000000"],
      ],
    },
  ],
  [
    StakingContract.XDEFI_UST,
    {
      type: ScheduleType.Block,
      values: [
        [0, 1, "0"],
        [6163500, 6575216, "20000000000000"],
        [6575217, 6986932, "20000000000000"],
        [6986933, 7398648, "20000000000000"],
      ],
    },
  ],
  [
    StakingContract.PSI_nLUNA,
    {
      type: ScheduleType.UnixTime,
      values: [[1643049900, 1668025800, "195601535097105"]],
    },
  ],
  [
    StakingContract.PSI_nETH,
    { type: ScheduleType.UnixTime, values: [[1643050200, 1668025800, "195599525638212"]] },
  ],
  [
    StakingContract.PSI_UST,
    { type: ScheduleType.UnixTime, values: [[1643049600, 1668025800, "165495934595097"]] },
  ],
  [
    StakingContract.MINE_UST,
    {
      type: ScheduleType.Block,
      values: [
        [3585500, 8491943, "750000000000000"],
        [8491943, 13398386, "250000000000000"],
        [13398386, 18304829, "250000000000000"],
        [18304829, 23211272, "250000000000000"],
      ],
    },
  ],
  [
    StakingContract.stLUNA_LUNA,
    {
      type: ScheduleType.Block,
      values: [
        [6256857, 6343257, "2500000000000"],
        [6343257, 6602457, "7500000000000"],
        [6602457, 7010000, "10000000000000"],
        [7010000, 7417500, "10000000000000"],
      ],
    },
  ],
  [
    StakingContract.stSOL_UST,
    {
      type: ScheduleType.Block,
      values: [
        [6256857, 6343257, "1500000000000"],
        [6343257, 6602457, "4500000000000"],
        [6602457, 7010000, "6000000000000"],
        [7010000, 7417500, "6000000000000"],
      ],
    },
  ],
  [
    StakingContract.stETH_UST,
    {
      type: ScheduleType.Block,
      values: [
        [6256857, 6343257, "1500000000000"],
        [6343257, 6602457, "4500000000000"],
        [6602457, 7010000, "6000000000000"],
        [7010000, 7417500, "6000000000000"],
      ],
    },
  ],
  [
    StakingContract.MARS_UST,
    {
      type: ScheduleType.UnixTime,
      values: [[1646650800, 1678186800, "10000000000000"]],
    },
  ],
  [
    StakingContract.ORNE_UST,
    {
      type: ScheduleType.Block,
      values: [
        [6864172, 11642353, "10000000000000"],
        [11642353, 21198715, "10000000000000"],
      ],
    },
  ],
  [
    StakingContract.wLDO_stLUNA,
    { type: ScheduleType.Block, values: [[6868500, 7276000, "1000000000000"]] },
  ],
  [
    StakingContract.SAYVE_UST,
    { type: ScheduleType.Block, values: [[6963234, 26370004, "1000000000000000"]] },
  ],
]);
