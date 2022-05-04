import { expect } from "chai";
import {
  getSwapRoute,
  PairResponse,
  pairsToGraph,
  priceImpact,
  priceImpactMultiSwap,
} from "services/swap.service";
import { getPairs, getPools } from "../../src/services";
import { PoolSortFields } from "../../src/types/pool.type";

// These test are run with prod data
// Current dev indexed data not enough to test these
// uncomment when develop data has been fully indexed
describe("services/swap.service", function () {
  let tokenGraph: any;

  // before(async () => {
  //   console.log("sstart");
  //   const pairs = (await getPairs()) || [];
  //   console.log(pairs.length);
  //   const pairMap: PairResponse[] = pairs?.map((i) => ({
  //     pair_type: i.type,
  //     liquidity_token: i.liquidityToken,
  //     contract_addr: i.contractAddr,
  //     asset_infos: [i.token1, i.token2],
  //   }));
  //   if (pairMap.length === 0) return;
  //   tokenGraph = pairsToGraph(pairMap);
  // });

  it("will be tested with more data", async () => {
    expect(true);
  });

  // it("gets price multi swap price impact", async () => {
  //   //orion to wsol
  //   const swapRoute = getSwapRoute({
  //     tokenGraph,
  //     from: "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03",
  //     to: "terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk",
  //   });

  //   if (!swapRoute) return;
  //   console.log(swapRoute);
  //   expect(swapRoute?.length).to.be.greaterThan(1);
  //   if (swapRoute?.length > 1) {
  //     const swapImpact = await priceImpactMultiSwap(swapRoute, "1000");
  //     expect(swapImpact).to.be.a("number");
  //   }
  // });

  // it("gets single pool price impact", async () => {
  //   // console.log(tokenGraph);
  //   const swapRoute = getSwapRoute({
  //     tokenGraph,
  //     from: "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03",
  //     to: "uusd",
  //   });
  //   console.log(swapRoute);
  //   expect(swapRoute?.length).to.be.eq(1);
  //   if (swapRoute?.length === 1) {
  //     const swapImpact = await priceImpact(swapRoute, "1000");
  //     expect(swapImpact).to.be.a("number");
  //   }
  // });
});
