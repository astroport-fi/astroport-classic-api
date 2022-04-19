import { expect } from "chai";
import { getCW20TokenHoldings } from "../../src/lib/terra";
import { getVotingPower } from "../../src/services/user.service";

describe("services/user.service", function () {
  it("get a valid user's voting power", async () => {
    const votingPower = await getVotingPower("terra1z5k2ln76p5xh63k6q50egnpz54pxqq2e2tppl6");
    expect(votingPower.from_xastro).to.be.a("number");
    expect(votingPower.from_builder).to.be.a("number");
    expect(votingPower.from_vxastro).to.be.a("number");
    expect(votingPower.total).to.be.a("number");
  });

  it("get an invalid user's voting power", async () => {
    const votingPower = await getVotingPower("invalidWalletAddress");
    expect(votingPower.from_xastro).to.be.a("number");
    expect(votingPower.from_xastro).to.equal(0);
    expect(votingPower.from_builder).to.be.a("number");
    expect(votingPower.from_builder).to.equal(0);
    expect(votingPower.from_vxastro).to.be.a("number");
    expect(votingPower.from_vxastro).to.equal(0);
    expect(votingPower.total).to.be.a("number");
    expect(votingPower.total).to.equal(0);
  });

  it("get holdings for single token and invalid wallet", async () => {
    const holding = await getCW20TokenHoldings(
      ["terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3"],
      "invalidWalletAddress"
    );
    expect(holding.size).to.equal(0);
  });

  it("get holdings for single token", async () => {
    const holding = await getCW20TokenHoldings(
      ["terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3"],
      "terra1z5k2ln76p5xh63k6q50egnpz54pxqq2e2tppl6"
    );
    expect(holding.size).to.equal(1);
    expect(holding.get("terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3")).to.not.be.undefined;
  });

  it("get holdings for multiple tokens", async () => {
    const holding = await getCW20TokenHoldings(
      [
        "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
        "terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7",
      ],
      "terra1z5k2ln76p5xh63k6q50egnpz54pxqq2e2tppl6"
    );
    expect(holding.size).to.equal(2);
    expect(holding.get("terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3")).to.not.be.undefined;
    expect(holding.get("terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7")).to.not.be.undefined;
  });
});
