import {
  getAirdrops,
  getPair,
  getPairs,
  getPriceByPairId,
  getSupply,
  getTokens,
  getPools, getPool
} from "../../services";

export const resolvers = {
  Pair: {
    prices: async ({ _id }: any) => {
      const prices = await getPriceByPairId(_id);
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
    pool: async (_: any, { address }: any) => {
      const pools = await getPool(address);
      return pools;
    },
    pools: async () => {
      const pools = await getPools();
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
