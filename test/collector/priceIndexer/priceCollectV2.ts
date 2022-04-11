import mongoose from "mongoose";
import { initHive } from "../../../src/lib/terra";
import { getPairs } from "../../../src/services";
import { MONGODB_URL, TERRA_HIVE } from "../../../src/constants";
import { priceCollectV2 } from "../../../src/collector/priceIndexer/priceCollectV2";

describe("Listen for protocol rewards", function () {
  beforeEach(async function () {
    await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
  });

  describe("Find all tokens with 8 digits", function () {
    it("finds em", async function () {
      const pairs = await getPairs();
      await priceCollectV2(pairs);
    });
  });
});
