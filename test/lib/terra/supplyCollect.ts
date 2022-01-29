import assert from "assert";
import {
  getContractAddressStore,
  getContractStore,
  getLatestBlock,
  initHive,
  initMantle
} from "../../../src/lib/terra";
import { BUILDER_UNLOCK, MULTISIG, ASTRO_TOKEN, ASTRO_UST_PAIR, VESTING_ADDRESS } from "../../../src/constants";
import { supplyCollect } from "../../../src/collector/supplyCollect";
import { connectToDatabase } from "../../../src/modules/db";

const builder_unlock_contract = BUILDER_UNLOCK!
const multisig = MULTISIG!
const astro_token = ASTRO_TOKEN!
const astro_ust_pair = ASTRO_UST_PAIR!


describe('Hive tests', function() {
  describe('Get Supply Stats Happy Path', function() {
    it('should return circ supply, astro price, tvl, 24h volume', async function() {

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const vesting = await getContractAddressStore(
        "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
        '{"balance": { "address": "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf" }}');


      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(JSON.parse(vesting.Result)?.balance);
    });
  });
});