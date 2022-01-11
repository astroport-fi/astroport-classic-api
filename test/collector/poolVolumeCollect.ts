import mongoose from "mongoose";
import { initHive, initMantle } from "../../src/lib/terra";
import { poolVolumeCollect } from "../../src/collector/poolVolumeCollect";


// TODO delete

const MONGODB_URL = "mongodb+srv://dexter:p7Fu933TUv1Gphzm@astro-dev-cluster.qxbq9.mongodb.net/astroport?authSource=admin&replicaSet=atlas-13c9d8-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true" as string

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