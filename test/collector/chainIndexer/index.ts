import mongoose from "mongoose";
import { getLunaExchangeRate, getTxBlock, initHive, initMantle } from "../../../src/lib/terra";
import { getPairs } from "../../../src/services";
import { pairListToMap } from "../../../src/collector/helpers";
import { runIndexers } from "../../../src/collector/chainIndexer";


const MONGODB_URL = "" as string

describe('Example test', function() {

  beforeEach( async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Test 1', function() {
    it('Test description', async function() {

      const height = 5979042;

      const pairs = await getPairs();
      const pairMap = pairListToMap(pairs);
      const exchangeRate = await getLunaExchangeRate("uusd")

      const block = await getTxBlock(height) // 2 swaps
      await runIndexers(block, height, pairMap, exchangeRate);
    });
  });

  describe('Listen for a APR transaction', function() {
    it('LP Deposit', async function() {

      const height = 6099231;

      const pairs = await getPairs();
      const pairMap = pairListToMap(pairs);
      const exchangeRate = await getLunaExchangeRate("uusd")

      const block = await getTxBlock(height) // 2 swaps
      await runIndexers(block, height, pairMap, exchangeRate);
    });
  });
});