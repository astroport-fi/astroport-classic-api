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
    // https://terrasco.pe/testnet/contracts/terra1zv9uhshhuw6yr4m95nx54cpl0g4ahska5uwfv8
    const poolInfo = await getGeneratorPoolInfo("terra1zv9uhshhuw6yr4m95nx54cpl0g4ahska5uwfv8");
    expect(poolInfo?.alloc_point).to.be.a("string");
    expect(poolInfo).to.haveOwnProperty("accumulated_rewards_per_share");
  });

  it("fetches contract config (proxy)", async () => {
    const config = await getContractConfig("terra1rmm3uh3ddrzxv5wfpcxt5vqvnel5r6dnjeng6t");
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
