import { expect } from "chai";
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
});
