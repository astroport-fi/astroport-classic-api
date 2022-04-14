import "dotenv/config";
import { expect } from "chai";

import { calculateThirdPartyApr } from "../../../src/collector/chainIndexer/calculateApr";

describe("calculateThirdPartyApr", function () {
  it("Should calculate apr and return a number", async () => {
    const height = 7166954;
    const res = calculateThirdPartyApr({
      factoryContract: "terra19nek85kaqrvzlxygw20jhy08h3ryjf5kg4ep3l",
      tokenPrice: 0.0445877,
      totalValueLocked: 45572901.69351934,
      latestBlock: height,
    });
    expect(res).to.be.a("number");
  });
});
