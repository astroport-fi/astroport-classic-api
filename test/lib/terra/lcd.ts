import { expect } from "chai";
import { getIBCDenom, getPairMessages } from "../../../src/lib/terra";

describe("LCD CLient", function () {
  it("fetches transaction from lcd and gets pair type of xyk", async () => {
    const hash = "4BC31A9FF21E27539A5E6C944442952C454A48F18061B4FDF525B68C395EE743";
    const messages = await getPairMessages(hash);
    const pair_type = messages?.create_pair?.pair_type || {};
    const type = Object.keys(pair_type).find(() => true);
    expect(type).to.be.eq("xyk");
  });

  it("fetches the denomination of an IBC token", async () => {
    const ibcAddress = "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B";
    const denom = await getIBCDenom(ibcAddress);
    expect(denom).to.be.eq("uosmo");
  });
});
