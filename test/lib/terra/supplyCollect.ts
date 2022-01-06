import assert from "assert";
import { getContractStore, getLatestBlock, initHive, initMantle } from "../../../src/lib/terra";
import { BUILDER_UNLOCK, MULTISIG, ASTRO_TOKEN, ASTRO_UST_PAIR } from "../../../src/constants";
import { supplyCollect } from "../../../src/collector/supplyCollect";
import { connectToDatabase } from "../../../src/modules/db";

const builder_unlock_contract = BUILDER_UNLOCK!
const multisig = MULTISIG!
const astro_token = ASTRO_TOKEN!
const astro_ust_pair = ASTRO_UST_PAIR!


describe('Hive tests', function() {
  describe('Get Supply Stats Happy Path', function() {
    it('should return circ supply, astro price, tvl, 24hr volume', async function() {

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      await supplyCollect()
    });
  });
});