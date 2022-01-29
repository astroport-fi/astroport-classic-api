import mongoose from "mongoose";
import { getPairLiquidity, initHive, initLCD, initMantle } from "../../src/lib/terra";
import { poolVolumeCollect } from "../../src/collector/poolVolumeCollect";
import { connectToDatabase } from "../../src/modules/db";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD, TERRA_MANTLE } from "../../src/constants";
import { getPairs } from "../../src/services";
import { pairListToMap } from "../../src/collector/helpers";
import { heightCollect } from "../../src/collector/heightCollect";
import { dailyCollect } from "../../src/collector/dailyCollect";
import { supplyCollect } from "../../src/collector/supplyCollect";
import { poolCollect } from "../../src/collector/poolCollect";
import { chainCollect } from "../../src/collector/chainCollect";


const MONGODB_URL = "" as string

describe('Example test', function() {

  beforeEach( async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Test 1', function() {
    it('Test description', async function() {

      await connectToDatabase();
      await initHive(TERRA_HIVE);
      await initMantle(TERRA_MANTLE);
      await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

      // eslint-disable-next-line no-constant-condition
      while(true) {
        // get pairs
        // map contract_address -> pair
        const pairs = await getPairs();
        const pairMap = pairListToMap(pairs);

        try {
          // height
          console.log("Indexing height...")
          await heightCollect();
          // prices
          console.log("Indexing prices...")
          await dailyCollect();
          // supply_timeseries
          console.log("Indexing supply...")
          await supplyCollect();
          // pool_timeseries
          console.log("Indexing pool_timeseries")
          await poolCollect();
          // pool_volume_24h
          console.log("Indexing pool_volume_24h")
          await poolVolumeCollect();
          // blocks, pairs, tokens, pool_volume
          console.log("Indexing chain...")
          await chainCollect(pairMap);
          console.log("Finished indexing")
        } catch (e) {
          console.log("Error while running indexer: " + e);
        }

      }
    });
  });
});