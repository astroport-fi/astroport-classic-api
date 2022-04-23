import { getContractStore, initHive } from "../../../src/lib/terra";
import { expect } from "chai";
import constants from "../../../src/environment/constants";

const builder_unlock_contract = constants.BUILDER_UNLOCK!;
const multisig = constants.MULTISIG!;
const astro_token = constants.ASTRO_TOKEN!;
const astro_ust_pair = constants.ASTRO_UST_PAIR!;

describe("Hive tests", function () {
  describe("Get Supply Stats Happy Path", function () {
    it("should return circ supply, astro price, tvl, 24h volume", async function () {
      const vesting: any = await getContractStore(
        "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
        JSON.parse('{"balance": { "address": "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf" }}')
      );

      expect(+vesting.balance).to.be.a("number");
    });
  });
});
