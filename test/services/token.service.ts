import { expect } from "chai";
import { isIBCToken, isNative } from "../../src/modules/terra";

describe("services/token.service", function () {
  it("is uluna a native token", async () => {
    const isNativeToken = isNative("uluna");
    expect(isNativeToken).to.be.true;
  });

  it("is uosmo IBC a native token", async () => {
    const isNativeToken = isNative(
      "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B"
    );
    expect(isNativeToken).to.be.false;
  });

  it("is uosmo IBC an IBC token", async () => {
    const isNativeToken = isIBCToken(
      "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B"
    );
    expect(isNativeToken).to.be.true;
  });

  it("is astro a native token", async () => {
    const isNativeToken = isNative("terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3");
    expect(isNativeToken).to.be.false;
  });
});
