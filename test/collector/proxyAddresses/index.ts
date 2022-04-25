import "dotenv/config";
import { expect } from "chai";
import {
  formatSchedules,
  generateScheduleType,
} from "../../../src/collector/proxyAddresses/helpers";
import { ProxyAddressInfo, ScheduleType } from "../../../src/types/contracts";
import { getProxyAddressesInfo } from "../../../src/collector/proxyAddresses";
import constants from "../../../src/environment/constants";

describe("getProxyAddressesInfo", function () {
  let addressesInfo: Map<string, ProxyAddressInfo>;

  before(async () => {
    addressesInfo = await getProxyAddressesInfo();
  });

  it("checks for bluna-luna Astro rewards", () => {
    if (addressesInfo) {
      const blunaRewards = addressesInfo.get(constants.BLUNA_LUNA_PAIR);
      expect(blunaRewards).to.haveOwnProperty("lpToken");
      expect(blunaRewards?.astro_yearly_emissions).to.be.a("number");
    }
  });

  it("checks for astro-ust Astro rewards", () => {
    if (addressesInfo) {
      const blunaRewards = addressesInfo.get(constants.ASTRO_UST_PAIR);
      expect(blunaRewards).to.haveOwnProperty("lpToken");
      expect(blunaRewards?.astro_yearly_emissions).to.be.a("number");
    }
  });

  it("checks for luna-ust Astro rewards", () => {
    if (addressesInfo) {
      const blunaRewards = addressesInfo.get(constants.LUNA_UST_PAIR);
      expect(blunaRewards).to.haveOwnProperty("lpToken");
      expect(blunaRewards?.astro_yearly_emissions).to.be.a("number");
    }
  });
});
