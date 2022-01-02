import assert from "assert";
import { getContractStore, getLatestBlock, initHive } from "../../../src/lib/terra";
import { ASTRO_BUILDER_UNLOCK_CONTRACT, ASTRO_MULTISIG, ASTRO_TOKEN, ASTRO_UST_PAIR } from "../../../src/constants";
import { supplyCollect } from "../../../src/collector/supplyCollect";
import { connectToDatabase } from "../../../src/modules/db";

const builder_unlock_contract = ASTRO_BUILDER_UNLOCK_CONTRACT!
const multisig = ASTRO_MULTISIG!
const astro_token = ASTRO_TOKEN!
const astro_ust_pair = ASTRO_UST_PAIR!


describe('Hive tests', function() {
  describe('Get Supply Stats Happy Path', function() {
    it('should return circ supply, astro price, tvl, 24hr volume', async function() {

      await initHive("https://hive.terra.dev/graphql");

      // const multisig_balance = await getContractStore(
      //   astro_token,
      //   JSON.parse(`{"balance": { "address": ${multisig} }}`));
      //
      // console.log(multisig_balance)

      await supplyCollect()
    });
  });
});