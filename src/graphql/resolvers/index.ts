import {
  getPair,
  getPairs,
  getPricesByPairId,
  getSupply,
  getTokens
} from "../../services";

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
