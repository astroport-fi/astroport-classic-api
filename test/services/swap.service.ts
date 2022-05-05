import { expect } from "chai";
import {
  getSwapRoute,
  pairsToGraph,
  priceImpact,
  priceImpactMultiSwap,
} from "services/swap.service";
import { getPairs, getPools } from "services";
import { PoolSortFields } from "types/pool.type";
import { PairResponse } from "types/swap.service.type";

describe("services/swap.service", function () {
  let tokenGraph: any;

  before(async () => {
    const pairs = (await getPairs()) || [];
    const pairMap: PairResponse[] = pairs?.map((i) => ({
      pair_type: i.type,
      liquidity_token: i.liquidityToken,
      contract_addr: i.contractAddr,
      asset_infos: [i.token1, i.token2],
    }));
    if (pairMap.length === 0) return;
    tokenGraph = pairsToGraph(pairMap);
  });

  it("gets single pool price impact", async () => {
    //Astro to ust
    const swapRoute = getSwapRoute({
      tokenGraph,
      from: "terra1jqcw39c42mf7ngq4drgggakk3ymljgd3r5c3r5",
      to: "uusd",
    });
    expect(swapRoute?.length).to.be.eq(1);
    if (swapRoute?.length === 1) {
      const swapImpact = await priceImpact(swapRoute, "1000");
      expect(swapImpact).to.be.a("number");
    }
  });

  it("gets price multi swap price impact", async () => {
    //Astro to ANC
    const swapRoute = getSwapRoute({
      tokenGraph,
      from: "terra1jqcw39c42mf7ngq4drgggakk3ymljgd3r5c3r5",
      to: "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc",
    });

    if (!swapRoute) return;
    expect(swapRoute?.length).to.be.greaterThan(1);
    if (swapRoute?.length > 1) {
      const swapImpact = await priceImpactMultiSwap(swapRoute, "1000");
      // console.log(swapImpact);
      expect(swapImpact).to.be.a("number");
    }
  });
});
