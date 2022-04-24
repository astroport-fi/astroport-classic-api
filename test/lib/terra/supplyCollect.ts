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
        constants.ASTRO_TOKEN,
        JSON.parse(`{"balance": { "address": "${constants.VESTING_ADDRESS}" }}`)
      );

      expect(+vesting.balance).to.be.a("number");
    });
  });
});
