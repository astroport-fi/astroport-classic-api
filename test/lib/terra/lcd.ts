import { expect } from "chai";
import { getPairMessages } from "../../../src/lib/terra";

describe("LCD CLient", function () {
  it("fetches transaction from lcd and gets pair type of xyk", async () => {
    const hash = "4BC31A9FF21E27539A5E6C944442952C454A48F18061B4FDF525B68C395EE743";
    const messages = await getPairMessages(hash);
    const pair_type = messages?.create_pair?.pair_type || {};
    const type = Object.keys(pair_type).find(() => true);
    expect(type).to.be.eq("xyk");
  });
});
