import { getContractConfig, getGeneratorPoolInfo } from "../../../src/lib/terra";
import { expect } from "chai";

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
});
