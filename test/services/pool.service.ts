import mongoose from "mongoose";
import { expect } from "chai";
import { initHive, initMantle } from "../../src/lib/terra";

import { MONGODB_URL, TERRA_HIVE, TERRA_MANTLE } from "../../src/constants";
import { getPools } from "../../src/services";
import { PoolSortFields } from "../../src/types/pool.type";

describe("services/pool.service", function () {
  it("get pools sort by tvl", async () => {
    const pools = await getPools({ sortField: PoolSortFields.TVL });
    const liquidityArr = pools.map((p) => p.pool_liquidity);
    expect(liquidityArr[0]).to.be.greaterThan(liquidityArr[1]);
    expect(liquidityArr[1]).to.be.greaterThan(liquidityArr[2]);
  });

  it("get pools sort by apr", async () => {
    const pools = await getPools({ sortField: PoolSortFields.APR });
    const aprArray = pools.map((p) => p.total_rewards.apr);
    expect(aprArray[0]).to.be.greaterThan(aprArray[1]);
    expect(aprArray[1]).to.be.greaterThan(aprArray[2]);
  });

  it("get pools sort by volume", async () => {
    const pools = await getPools({ sortField: PoolSortFields.VOLUME });
    const volumeArr = pools.map((p) => p.total_rewards.day);
    expect(volumeArr[0]).to.be.greaterThan(volumeArr[1]);
    expect(volumeArr[1]).to.be.greaterThan(volumeArr[2]);
  });
});
