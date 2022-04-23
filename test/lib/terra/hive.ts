import {
  getContractConfig,
  getContractStore,
  getGeneratorPoolInfo,
  getLatestBlock,
} from "../../../src/lib/terra";
import { expect } from "chai";
import constants from "../../../src/environment/constants";

describe("Hive", function () {
  it("fetches alloc points", async () => {
    const poolInfo = await getGeneratorPoolInfo("terra1cspx9menzglmn7xt3tcn8v8lg6gu9r50d7lnve");
    expect(poolInfo?.alloc_point).to.be.a("string");
    expect(poolInfo).to.haveOwnProperty("accumulated_rewards_per_share");
  });

  it("fetches contract config", async () => {
    const config = await getContractConfig("terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8");
    expect(config).to.haveOwnProperty("pair_addr");
    expect(config).to.haveOwnProperty("generator_contract_addr");
  });

  it("gets total_astro_staked from getContractStore", async () => {
    let total_astro_staked: any = await getContractStore(
      constants.ASTRO_TOKEN,
      JSON.parse('{"balance": { "address": "' + constants.XASTRO_STAKING_ADDRESS + '" }}')
    );
    total_astro_staked = total_astro_staked?.balance / 1000000;
    expect(total_astro_staked).to.be.a("number");
  });

  it("gets treasury balance from getContractStore", async () => {
    const treasury: any = await getContractStore(
      constants.ASTRO_TOKEN,
      JSON.parse('{"balance": { "address": "' + constants.ASSEMBLY_TREASURY + '" }}')
    );
    expect(+treasury?.balance).to.be.a("number");
  });

  it("get Latest Height", async () => {
    const height = (await getLatestBlock()).height;
    expect(height).to.be.a("number");
  });
});
