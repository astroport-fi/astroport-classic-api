import { getAirdrops, getPair, getPairs, getPool, getPools, getSupply, getTokens } from "../../services";
import { getStats } from "../../services/astroport_stats.service";
import { getPrice } from "../../services/priceV2.service";

export const resolvers = {
  // Pair: {
  //   prices: async ({ _id }: any) => {
  //     const prices = await getPriceByPairId(_id);
  //     return prices;
  //   },
  // },

  Query: {
    airdrop: async(_: any, { address }: any) => {
      const airdrops = await getAirdrops(address);
      return airdrops
    },
    stats: async() => {
      const stats = await getStats();
      return stats
    },
    pair: async (_: any, { contractAddr }: any) => {
      const pair = await getPair(contractAddr);
      return pair;
    },
    pairs: async () => {
      const pairs = await getPairs();
      return pairs;
    },
    price: async(_: any, { tokenAddress }: any) => {
      const price = await getPrice(tokenAddress);
      return price
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
