import "dotenv/config";
import { expect } from "chai";
import {
  formatSchedules,
  generateScheduleType,
} from "../../../src/collector/proxyAddresses/helpers";
import { ScheduleType } from "../../../src/types/contracts";
// import { getProxyAddressesInfo } from "../../../src/collector/proxyAddresses";

describe("get proxyAddresses helpers", function () {
  it("generates schedule type equal to unix", async () => {
    const type = generateScheduleType([
      [1641805200, 1642410000, "1160000000000"],
      [1642410000, 1643014800, "1160000000000"],
      [1643014800, 1643619600, "1160000000000"],
      [1643619600, 1644224400, "1160000000000"],
      [1644224400, 1644829200, "1160000000000"],
    ]);
    expect(type).to.be.eq(ScheduleType.UnixTime);

    const type2 = generateScheduleType([
      [1641805200, 1642410000, "1160000000000"],
      [1642410000, 1643014800, "1160000000000"],
      [1643014800, 1643619600, "1160000000000"],
    ]);
    expect(type2).to.be.eq(ScheduleType.UnixTime);
  });

  it("generates schedule type equal to block", async () => {
    const type = generateScheduleType([[6018800, 6850000, "19753544179118"]]);
    expect(type).to.be.eq(ScheduleType.Block);
    const type2 = generateScheduleType([
      [6602457, 7010000, "6000000000000"],
      [7010000, 7417500, "6000000000000"],
    ]);
    expect(type2).to.be.eq(ScheduleType.Block);
  });

  it("Formats [[number, number, string]] schedule to the expected format", () => {
    const schedules = formatSchedules([[6018800, 6850000, "19753544179118"]], {});
    expect(schedules[0][0]).to.be.a("number");
    expect(schedules[0][1]).to.be.a("number");
    expect(schedules[0][2]).to.be.a("string");
  });

  it("Formats [{start_time: number, end_time: number}] schedule to the expected format", () => {
    const schedules = formatSchedules(
      [{ start_time: 1642104349, end_time: 1642104361, amount: "0" }],
      {}
    );
    expect(schedules[0][0]).to.be.a("number");
    expect(schedules[0][1]).to.be.a("number");
    expect(schedules[0][2]).to.be.a("string");
  });

  it("Formats [number, number, string] schedule to the expected format", () => {
    const schedules = formatSchedules([1647446401, 1650038400, "15000000000000"], {});
    expect(schedules[0][0]).to.be.a("number");
    expect(schedules[0][1]).to.be.a("number");
    expect(schedules[0][2]).to.be.a("string");
  });

  // it("getProxyAddressesInfo", async () => {
  //   const start = Date.now();
  //   const address = await getProxyAddressesInfo();
  //   const duration = Date.now() - start;
  //   console.log(duration);
  // });
});
