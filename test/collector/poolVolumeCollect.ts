import mongoose from "mongoose";
import { initHive, initMantle } from "../../src/lib/terra";
import { poolVolumeCollect } from "../../src/collector/poolVolumeCollect";


// TODO delete

const MONGODB_URL = "" as string

describe('Example test', function() {

  beforeEach( async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Test 1', function() {
    it('Test description', async function() {

      await poolVolumeCollect();
    });
  });
});