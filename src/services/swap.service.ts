import { getTokenDenom, isNative } from "../modules/terra";
import { BatchQuery } from "../types/hive.type";
import { batchQuery, getContractStore } from "../lib/terra";
import { getTokenOrCreate } from "./token.service";
import { num } from "../lib/num";
import BigNumber from "bignumber.js";
import {
  Route,
  AssetInfo,
  SwapSimulate,
  PoolAssets,
  PoolAmounts,
  PairResponse,
  TokenGraphEdge,
  TokenGraphAdjacencyList,
} from "../types/swap.service.type";

export const toAssetInfo = (token: string): AssetInfo => {
  if (isNative(token)) {
    return { native_token: { denom: token } };
  }
  return { token: { contract_addr: token } };
};

export const simulateSwap = async (route: Route, amount: string): Promise<SwapSimulate> => {
  const query = JSON.stringify({
    simulation: {
      offer_asset: {
        amount,
        info: toAssetInfo(route.from),
      },
    },
  });
  const res = await getContractStore(route.contract_addr, JSON.parse(query));
  return res as SwapSimulate;
};

export const getPoolsAssets = async (pools: string[]): Promise<PoolAssets[][]> => {
  const queries: BatchQuery[] = pools.map((contract) => ({
    query: `
      query ($contract: String!) {
        wasm {
          contractQuery(contractAddress: $contract, query: { pool: {} })
        }
      }
    `,
    variables: {
      contract,
    },
  }));

  const response = await batchQuery(queries);
  return response?.map((i) => i?.data?.wasm?.contractQuery?.assets) as PoolAssets[][];
};

export const assetAmountsInPool = (assets: any): PoolAmounts => {
  return assets.reduce((prev: any, a: any) => {
    const key = getTokenDenom(a.info);
    return {
      ...prev,
      [key]: a.amount,
    };
  }, {});
};

export const priceImpact = async (swapRoutes: Route[], inputAmount: string): Promise<number> => {
  const poolsAssets = (await getPoolsAssets(swapRoutes.map((i) => i.contract_addr))) || [];
  const poolAsset = poolsAssets[0];
  const route = swapRoutes[0];
  let priceImpactResponse;
  if (route?.type === "xyk") {
    priceImpactResponse = await priceImpactXYK(route, poolAsset, Number(inputAmount));
  }
  if (route.type === "stable") {
    priceImpactResponse = await priceImpactStable(route, Number(inputAmount));
  }
  if (!priceImpactResponse) return 0;
  const { impact } = priceImpactResponse;
  return impact;
};

export const priceImpactMultiSwap = async (
  swapRoutes: Route[],
  inputAmount: string
): Promise<number> => {
  const poolsAssets = (await getPoolsAssets(swapRoutes.map((i) => i.contract_addr))) || [];
  let nextSwapInputAmount = Number(inputAmount);
  const impacts = [];
  for (const [i, route] of swapRoutes.entries()) {
    let priceImpactResponse;

    if (route.type === "xyk") {
      priceImpactResponse = await priceImpactXYK(route, poolsAssets[i], nextSwapInputAmount);
    }

    if (route.type === "stable") {
      priceImpactResponse = await priceImpactStable(route, nextSwapInputAmount);
    }

    if (!priceImpactResponse) continue;
    const { impact, nextAmount } = priceImpactResponse;
    // console.log(impact, nextAmount);
    nextSwapInputAmount = nextAmount;
    impacts.push(impact);
  }

  return num(impacts.reduce((acc, i) => acc + i, 0))
    .dp(2)
    .toNumber();
};

export const priceImpactXYK = async (
  route: Route,
  poolAsset: PoolAssets[],
  inputAmount: number
): Promise<{ impact: number; nextAmount: number } | null> => {
  if (!route) return null;
  try {
    const amounts = assetAmountsInPool(poolAsset);
    const fromAmount = amounts[route.from];
    const toAmount = amounts[route.to];
    const fromInfo = await getTokenOrCreate(route.from);
    const toInfo = await getTokenOrCreate(route.to);
    const fromDecimals = fromInfo?.decimals;
    const toDecimals = toInfo?.decimals;
    const amount = (inputAmount * 10 ** fromDecimals).toString();
    const poolPrice = num(fromAmount)
      .div(10 ** fromDecimals)
      .div(num(toAmount).div(10 ** toDecimals))
      .dp(18)
      .toNumber();
    const swapSimulate = await simulateSwap(route, amount);
    const swapPrice = num(amount)
      .div(10 ** fromDecimals)
      .div(num(swapSimulate.return_amount).div(10 ** toDecimals))
      .toFixed(18);

    const nextAmount = num(swapSimulate.return_amount)
      .div(10 ** toDecimals)
      .toNumber();

    return {
      impact: num(swapPrice).minus(poolPrice).div(poolPrice).times(100).dp(2).toNumber(),
      nextAmount,
    };
  } catch (e) {
    return null;
  }
};

export const priceImpactStable = async (
  route: Route,
  inputAmount: number
): Promise<{ impact: number; nextAmount: number } | null> => {
  if (!route) return null;
  try {
    const fromInfo = await getTokenOrCreate(route.from);
    const toInfo = await getTokenOrCreate(route.to);
    const fromDecimals = fromInfo?.decimals;
    const toDecimals = toInfo?.decimals;
    const amount = (inputAmount * 10 ** fromDecimals).toString();

    const [data, dataB] = await Promise.all([
      // swap simulation
      simulateSwap(route, amount),
      // price simulation
      simulateSwap(route, "100000"),
    ]);

    const swapPrice = num(amount)
      .div(10 ** fromDecimals)
      .div(num(data.return_amount).div(10 ** toDecimals))
      .toFixed(18);

    const price = num(dataB.return_amount)
      .plus(dataB.commission_amount)
      .div(10 ** 5)
      .toNumber();

    const nextAmount = num(data.return_amount)
      .div(10 ** toDecimals)
      .toNumber();

    return {
      impact: num(1)
        .minus(num(price).div(swapPrice))
        .times(100)
        .dp(2, BigNumber.ROUND_HALF_UP)
        .abs()
        .toNumber(),
      nextAmount,
    };
  } catch (e) {
    return null;
  }
};

//Below functions are exported For testing purposes
export const pairsToRoute = (pairs: PairResponse[], from: string): Route[] => {
  return pairs.reduce<Route[]>((routes, pair, i) => {
    const tokens = pair.asset_infos;

    const previousTo = i == 0 ? from : routes[i - 1].to;

    if (tokens[0] != previousTo) {
      tokens.reverse();
    }

    return [
      ...routes,
      {
        from: tokens[0],
        to: tokens[1],
        contract_addr: pair.contract_addr,
        type: pair.pair_type,
      },
    ];
  }, []);
};

export const pairsToGraph = (pairs: PairResponse[]): TokenGraphAdjacencyList => {
  const adjacencyList: TokenGraphAdjacencyList = {};
  for (const pair of pairs) {
    for (const token of pair.asset_infos) {
      //   console.log(token);
      adjacencyList[token] ||= new Set<TokenGraphEdge>();
      const otherToken = pair.asset_infos.find((token2) => token2 != token);
      // Add edge
      adjacencyList[token].add({
        pair,
        token: otherToken as string,
      });
    }
  }
  //   console.log(adjacencyList);
  return adjacencyList;
};
// TokenGraphAdjacencyList
export const getSwapRoute = ({
  tokenGraph,
  from,
  to,
}: {
  tokenGraph: TokenGraphAdjacencyList | null;
  from: string;
  to: string;
}): Route[] | null => {
  if (tokenGraph == null || from == null || to == null) {
    return null;
  }

  if (from == to) {
    return [];
  }

  type EnqueuedSearchNode = {
    token: string;
    pairs: PairResponse[];
  };

  const queue: EnqueuedSearchNode[] = [{ token: from, pairs: [] }];

  const visited = new Set<string>(from);

  while (queue.length > 0) {
    const node = queue.shift() as EnqueuedSearchNode;

    for (const neighbor of Array.from(tokenGraph[node.token])) {
      const pairs = [...node.pairs, neighbor.pair];

      if (neighbor.token == to) {
        return pairsToRoute(pairs, from);
      }

      if (!visited.has(neighbor.token)) {
        visited.add(neighbor.token);
        queue.push({ token: neighbor.token, pairs });
      }
    }
  }

  return null;
};
