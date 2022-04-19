import { expect } from "chai";
import { generateDescription } from "../../../src/collector/chainIndexer/createPairIndex";

describe("generateDescription", function () {
  it("Generates description for ibc asset and native asset", async () => {
    const description = await generateDescription(
      null,
      null,
      "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B",
      "uusd"
    );
    expect(description).to.contain("osmo");
    expect(description).to.contain("UST");
  });
});
