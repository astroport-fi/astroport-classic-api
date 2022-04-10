import "dotenv/config";
import mongoose from "mongoose";
import { expect } from "chai";
import { getLatestBlock, initHive } from "../../src/lib/terra";

import { MONGODB_URL, TERRA_HIVE } from "../../src/constants";
// import { priceCollectV2 } from "../../../src/collector/priceIndexer/priceCollectV2";

import { calculateThirdPartyApr } from "../../src/collector/chainIndexer/calculateApr";
import { getPools, transformPoolModelToPoolType } from "../../src/services";
import { PoolSortFields } from "../../src/types/pool.type";

declare module "dayjs" {
  interface Dayjs {
    utc(): any;
  }
}

describe("pool.service", function () {
  beforeEach(async function () {
    await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
  });

  it("get pools sort by tvl", async () => {
    const pools = await getPools({ sortField: PoolSortFields.TVL });
    const liquidityArr = pools.map((p) => p.pool_liquidity);
    console.log(liquidityArr);
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
