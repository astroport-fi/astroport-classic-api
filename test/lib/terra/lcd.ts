import { expect } from "chai";
import { getIBCDenom, getPairMessages } from "../../../src/lib/terra";

describe("LCD CLient", function () {
  it("fetches transaction from lcd and gets pair type of xyk (create pair)", async () => {
    const hash = "625C08AE6F50DE97931218B5FB35BA5435D2B2345519FCDD4DCF5929BBFC2226";
    const messages = await getPairMessages(hash);
    const pair_type = messages?.create_pair?.pair_type || {};
    const type = Object.keys(pair_type).find(() => true);
    expect(type).to.be.eq("xyk");
  });

  // TODO This test needs to be updates, when I find an IBC token on testnet
  it("fetches the denomination of an IBC token", async () => {
    console.log("Fix test when IBC token available on testnet");
    // const ibcAddress = "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B";
    // const denom = await getIBCDenom(ibcAddress);
    // expect(denom).to.be.eq("uosmo");
  });
});
