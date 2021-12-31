import assert from "assert";
import { getLatestBlock, getTokenSupply, initHive } from "../../../src/lib/terra";



describe('Hive tests', function() {
  describe('Get Supply Stats Happy Path', function() {
    it('should return circ supply, astro price, tvl, 24hr volume', async function() {
      
      const hive = await initHive("https://testnet-hive.terra.dev/graphql");

      //await getLatestBlock()
      await getTokenSupply();

      // assert.equal("multisig", "");
    });
  });
});