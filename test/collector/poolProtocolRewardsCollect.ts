import mongoose from "mongoose";
import { initHive, initMantle } from "../../src/lib/terra";
import { poolProtocolRewardsCollect } from "../../src/collector/poolProtocolRewardsCollect";


// TODO delete

const MONGODB_URL = ""

describe('Protocol rewards collector test', function() {

  beforeEach(async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Aggregate pool protocol rewards', function() {
    it('Test description', async function() {
      await poolProtocolRewardsCollect();
    });
  });
});