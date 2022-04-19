import { expect } from "chai";

import { calculateThirdPartyApr } from "../../../src/collector/chainIndexer/calculateApr";
import { ScheduleType } from "../../../src/types/contracts";

describe("calculateThirdPartyApr", function () {
  it("Should calculate apr and return a number", async () => {
    const height = 7166954;
    const res = calculateThirdPartyApr({
      schedules: {
        values: [
          [3585500, 8491943, "750000000000000"],
          [8491943, 13398386, "250000000000000"],
          [13398386, 18304829, "250000000000000"],
          [18304829, 23211272, "250000000000000"],
        ],
        type: ScheduleType.Block,
      },
      tokenPrice: 0.0445877,
      totalValueLocked: 45572901.69351934,
      latestBlock: height,
    });
    expect(res).to.be.a("number");
  });
});
