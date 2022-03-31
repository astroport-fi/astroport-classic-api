import mongoose from "mongoose";
import { initHive, initMantle } from "../../../src/lib/terra";
import { poolCollect } from "../../../src/collector/poolCollect";

const MONGODB_URL = ""

describe('Protocol rewards collector test', function() {

  beforeEach(async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Aggregate pool protocol rewards', function() {
    it('Test description', async function() {
      const result = await poolCollect();
      console.log(result)
    });
  });
});