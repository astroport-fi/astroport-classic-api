import { expect } from "chai";
import constants from "../../src/environment/constants";
import { getCW20TokenHoldings } from "../../src/lib/terra";
import { getUserStakedLpTokens, getVotingPower } from "../../src/services/user.service";

describe("services/user.service", function () {
  it("get a valid user's voting power", async () => {
    const votingPower = await getVotingPower(constants.TESTNET_WALLET_ADDRESS);
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
    const holding = await getCW20TokenHoldings([constants.ASTRO_TOKEN], "invalidWalletAddress");
    expect(holding.size).to.equal(0);
  });

  it("get holdings for single token", async () => {
    const holding = await getCW20TokenHoldings(
      [constants.ASTRO_TOKEN],
      constants.TEST_WALLET_ADDRESS
    );
    expect(holding.size).to.equal(1);
    expect(holding.get(constants.ASTRO_TOKEN)).to.not.be.undefined;
  });

  it("get holdings for multiple tokens", async () => {
    const holding = await getCW20TokenHoldings(
      [constants.ASTRO_TOKEN, constants.XASTRO_TOKEN],
      constants.TEST_WALLET_ADDRESS
    );
    expect(holding.size).to.equal(2);
    expect(holding.get(constants.ASTRO_TOKEN)).to.not.be.undefined;
    expect(holding.get(constants.XASTRO_TOKEN)).to.not.be.undefined;
  });

  it("gets users staked lp balance", async () => {
    console.log("Fix test after indexing testnet pairs");
    // const stakedLpTokens = await getUserStakedLpTokens(constants.TEST_WALLET_ADDRESS);
    // // console.log(stakedLpTokens);
    // const singleStaked = stakedLpTokens.find(() => true);
    // expect(singleStaked).to.haveOwnProperty("pool_address");
    // expect(singleStaked).to.haveOwnProperty("lp_token_address");
    // expect(singleStaked).to.haveOwnProperty("pool_type");
    // expect(singleStaked).to.haveOwnProperty("pool_fees");
    // expect(singleStaked?.pool_fees).to.be.a("number");
  });
});
