import mongoose from "mongoose";
import { getPairLiquidity, initHive, initMantle } from "../../src/lib/terra";
import { poolVolumeCollect } from "../../src/collector/poolVolumeCollect";


const MONGODB_URL = "" as string

describe('Example test', function() {

  beforeEach( async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Test 1', function() {
    it('Test description', async function() {

      // await poolVolumeCollect();
      const respone = await getPairLiquidity("terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", JSON.parse('{ "pool": {} }'))
      console.log(respone)
    });
  });
});