import { expect } from "chai";
import { getPools } from "../../src/services";
import { PoolSortFields } from "../../src/types/pool.type";

describe("services/pool.service", function () {
  it("get pools sort by tvl", async () => {
    const pools = await getPools({ sortField: PoolSortFields.TVL });
    const liquidityArr = pools.map((p) => p.pool_liquidity);
    expect(liquidityArr[0]).to.be.greaterThan(liquidityArr[1]);
    expect(liquidityArr[1]).to.be.greaterThan(liquidityArr[2]);
  });

  // TODO uncomment tests when dev data has been re-indexed.

  // it("get pools sort by apr", async () => {
  //   const pools = await getPools({ sortField: PoolSortFields.APR });
  //   const aprArray = pools.map((p) => p.total_rewards.apr);
  //   expect(aprArray[0]).to.be.greaterThan(aprArray[1]);
  //   expect(aprArray[1]).to.be.greaterThan(aprArray[2]);
  // });

  // it("get pools sort by volume", async () => {
  //   const pools = await getPools({ sortField: PoolSortFields.VOLUME });
  //   const volumeArr = pools.map((p) => p.total_rewards.day);
  //   expect(volumeArr[0]).to.be.greaterThan(volumeArr[1]);
  //   expect(volumeArr[1]).to.be.greaterThan(volumeArr[2]);
  // });

  // it("checks whether search term is address, searches by pool adress", async () => {
  //   const orneUstPoolAddress = "terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg";
  //   const pools = await getPools({ search: orneUstPoolAddress });
  //   const orneUstPool = pools.find(() => true);
  //   expect(pools).to.have.lengthOf(1);
  //   expect(orneUstPool?.pool_address).to.be.eq(orneUstPoolAddress);
  // });

  // it("searches for pools containing any token with sol", async () => {
  //   const pools = await getPools({ search: "sol" });
  //   //TOD add more checks
  //   expect(pools.length).to.be.greaterThan(1);
  // });

  // it("searches for pools containing any token with eth", async () => {
  //   const pools = await getPools({ search: "eth" });
  //   expect(pools.length).to.be.greaterThan(1);
  // });

  it("searches for pools containing any token with psi", async () => {
    const pools = await getPools({ search: "psi" });
    expect(pools.length).to.be.greaterThan(1);
  });
});
