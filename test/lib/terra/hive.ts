import "dotenv/config";
import mongoose from "mongoose";
import {
  getContractConfig,
  getGeneratorPoolInfo,
  initHive,
  initMantle,
} from "../../../src/lib/terra";
import { MONGODB_URL } from "../../../src/constants";
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
    await initMantle("https://mantle.terra.dev/graphql");
  });

  it("fetches alloc points", async () => {
    const poolInfo = await getGeneratorPoolInfo("terra1cspx9menzglmn7xt3tcn8v8lg6gu9r50d7lnve");
    expect(poolInfo?.alloc_point).to.be.a.string;
    console.log(poolInfo?.alloc_point);
  });

  it("fetches contract config", async () => {
    const config = await getContractConfig("terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8");
    expect(config).to.haveOwnProperty("pair_addr");
    expect(config).to.haveOwnProperty("generator_contract_addr");
  });
});
