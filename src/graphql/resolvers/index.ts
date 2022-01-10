import {
  getPair,
  getPairs,
  getPricesByPairId,
  getSupply,
  getTokens
} from "../../services";
import { getOnePoolTimeseries, getPoolTimeseries } from "../../services/pool_timeseries.service";

export const resolvers = {
  Pair: {
    prices: async ({ _id }: any) => {
      const prices = await getPricesByPairId(_id);
      return prices;
    },
  },

  Query: {
    pair: async (_: any, { contractAddr }: any) => {
      const pair = await getPair(contractAddr);
      return pair;
    },
    pairs: async () => {
      const pairs = await getPairs();
      return pairs;
    },
    pool: async () => {
      const pool = await getOnePoolTimeseries();
      return pool
    },
    pools: async () => {
      const pools = await getPoolTimeseries();
      return pools;
    },
    supply: async() => {
      const supply = await getSupply();
      console.log("supply inside resolvers/index.ts: " + supply)
      console.log("circ supply: " + supply.circulatingSupply)

      return supply;
    },
    tokens: async () => {
      const tokens = await getTokens();
      return tokens;
    },
  },
};
