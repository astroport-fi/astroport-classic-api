import {
  getAirdrops,
  getBlockResponse,
  getPool,
  getPools,
  getSupply
} from "../../services";
import { getStats } from "../../services/astroport_stats.service";
import { getPriceByTokenAddress } from "../../services/priceV2.service";
import { getStakingStats } from "../../services/xastro_fee_stat.service";

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
    block: async() => {
      const block = await getBlockResponse();
      return block
    },
    stats: async() => {
      const stats = await getStats();
      return stats
    },
    price: async(_: any, { tokenAddress }: any) => {
      const price = await getPriceByTokenAddress(tokenAddress);
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
    staking: async() => {
      const xastro_fee_stat = await getStakingStats()
      return xastro_fee_stat;
    }
  },
};
