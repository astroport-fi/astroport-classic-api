import {
  getAirdrops,
  getPair,
  getPairs,
  getPricesByPairId,
  getSupply,
  getTokens
} from "../../services";
import { getPoolTimeseries } from "../../services/pool_timeseries.service";

export const resolvers = {
  Pair: {
    prices: async ({ _id }: any) => {
      const prices = await getPricesByPairId(_id);
      return prices;
    },
  },

  Query: {
    airdrop: async(_: any, { address }: any) => {
      const airdrops = await getAirdrops(address);
      return airdrops
    },
    pair: async (_: any, { contractAddr }: any) => {
      const pair = await getPair(contractAddr);
      return pair;
    },
    pairs: async () => {
      const pairs = await getPairs();
      return pairs;
    },
    pools: async () => {
      const pools = await getPoolTimeseries();
      return pools;
    },
    supply: async() => {
      const supply = await getSupply();
      return supply;
    },
    tokens: async () => {
      const tokens = await getTokens();
      return tokens;
    },
  },
};
