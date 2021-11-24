import { getPair, getPricesByPairId, getTvl, getVault } from '../../services';

export const resolvers = {
  Pair: {
    prices: async ({ _id }: any) => {
      const prices = await getPricesByPairId(_id);
      return prices;
    },
  },

  Query: {
    pair: async (_: any, { contractAddress }: any) => {
      const pair = await getPair(contractAddress);
      return pair;
    },
    tvl: async () => {
      const tvl = await getTvl();
      return tvl;
    },
    vault: async () => {
      const vault = await getVault();
      return vault;
    },
  },
};
