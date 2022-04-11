import "dotenv/config";
import mongoose from "mongoose";
import {
  getContractConfig,
  getContractStore,
  getGeneratorPoolInfo,
  getLatestBlock,
  initHive,
} from "../../../src/lib/terra";
import {
  GENERATOR_ADDRESS,
  MONGODB_URL,
  ASSEMBLY_TREASURY,
  ASTRO_TOKEN,
  XASTRO_STAKING_ADDRESS,
} from "../../../src/constants";
import { expect } from "chai";
import { getPairs } from "../../../src/services";

declare module "dayjs" {
  interface Dayjs {
    utc(): any;
  }
}

describe("Hive", function () {
  beforeEach(async function () {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
  });

  it("fetches alloc points", async () => {
    const poolInfo = await getGeneratorPoolInfo("terra1cspx9menzglmn7xt3tcn8v8lg6gu9r50d7lnve");
    expect(poolInfo?.alloc_point).to.be.a("string");
  });

  it("fetches contract config", async () => {
    const config = await getContractConfig("terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8");
    expect(config).to.haveOwnProperty("pair_addr");
    expect(config).to.haveOwnProperty("generator_contract_addr");
  });

  it("gets total_astro_staked from getContractStore", async () => {
    let total_astro_staked: any = await getContractStore(
      ASTRO_TOKEN,
      JSON.parse('{"balance": { "address": "' + XASTRO_STAKING_ADDRESS + '" }}')
    );
    total_astro_staked = total_astro_staked?.balance / 1000000;
    expect(total_astro_staked).to.be.a("number");
  });

  it("gets treasury balance from getContractStore", async () => {
    const treasury: any = await getContractStore(
      ASTRO_TOKEN,
      JSON.parse('{"balance": { "address": "' + ASSEMBLY_TREASURY + '" }}')
    );
    expect(+treasury?.balance).to.be.a("number");
  });

  it("get Latest Height", async () => {
    const height = (await getLatestBlock()).height;
    expect(height).to.be.a("number");
  });
});
