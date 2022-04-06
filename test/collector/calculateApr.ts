import "dotenv/config";
import mongoose from "mongoose";
import { expect } from "chai";
import { getLatestBlock, initHive, initMantle } from "../../src/lib/terra";

import { MONGODB_URL, TERRA_HIVE, TERRA_MANTLE } from "../../src/constants";
// import { priceCollectV2 } from "../../../src/collector/priceIndexer/priceCollectV2";

import { calculateThirdPartyApr } from "../../src/collector/chainIndexer/calculateApr";

describe("Index new pairs", function () {
  beforeEach(async function () {
    await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
    await initMantle(TERRA_MANTLE);
  });

  describe("Create pair and tokens on create_pair event", async () => {
    it("Should get transaction and index coin data", async () => {
      const { height } = await getLatestBlock();
      const res = calculateThirdPartyApr({
        factoryContract: "terra19nek85kaqrvzlxygw20jhy08h3ryjf5kg4ep3l",
        tokenPrice: 0.0445877,
        totalValueLocked: 45572901.69351934,
        latestBlock: height,
      });
      expect(res).to.be.a("number");
    });
  });
});
