import { getContractStore, initHive } from "../../../src/lib/terra";
import { ASTRO_TOKEN, ASTRO_UST_PAIR, BUILDER_UNLOCK, MULTISIG } from "../../../src/constants";

const builder_unlock_contract = BUILDER_UNLOCK!;
const multisig = MULTISIG!;
const astro_token = ASTRO_TOKEN!;
const astro_ust_pair = ASTRO_UST_PAIR!;

describe("Hive tests", function () {
  describe("Get Supply Stats Happy Path", function () {
    it("should return circ supply, astro price, tvl, 24h volume", async function () {
      await initHive("https://hive.terra.dev/graphql");

      const vesting = await getContractStore(
        "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
        JSON.parse('{"balance": { "address": "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf" }}')
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(parseInt(vesting.balance));
    });
  });
});
