/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAirdrops,
  getBlockResponse,
  getPool,
  getPools,
  getSupply,
  getToken,
  getTokens,
} from "../../services";
import { getStats } from "../../services/astroport_stats.service";
import { getPriceByTokenAddress } from "../../services/priceV2.service";
import { getStakingStats } from "../../services/xastro_fee_stat.service";
import { getProposal, getProposals } from "../../services/proposal.service";
import { getVotes } from "../../services/vote.service";
import GraphQLJSON from "graphql-type-json";
import { getSnapshots } from "../../services/snapshot.service";
import { Pool } from "../../types/pool.type";
import {
  getAllTokenHoldings,
  getVotingPower,
  getBlunaUstRewards,
  getUserStakedLpTokens,
} from "../../services/user.service";
import { User } from "../../types/user.type";
import { parseResolveInfo } from "../../lib/graphql-parse-resolve-info";

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    airdrop: async (_: any, { address }: any) => {
      const airdrops = await getAirdrops(address);
      return airdrops;
    },
    block: async () => {
      const block = await getBlockResponse();
      return block;
    },
    stats: async () => {
      const stats = await getStats();
      return stats;
    },
    price: async (_: any, { tokenAddress }: any) => {
      const price = await getPriceByTokenAddress(tokenAddress);
      return price;
    },
    pool: async (_: any, { address }: any) => {
      const pools = await getPool(address);
      return pools;
    },
    pools: async (
      _: any,
      { search, limit, offset, sortField, sortDirection }: any
    ): Promise<Pool[]> => {
      const pools = await getPools({
        search,
        limit,
        offset,
        sortField,
        sortDirection,
      });
      return pools;
    },
    proposal: async (_: any, { proposal_id }: any) => {
      const proposal = await getProposal(proposal_id);
      return proposal;
    },
    proposals: async () => {
      const proposals = await getProposals();
      return proposals;
    },
    snapshot: async (_: any, { limit, offset }: any) => {
      const snapshots = await getSnapshots(limit, offset);
      return snapshots;
    },
    supply: async () => {
      const supply = await getSupply();
      return supply;
    },
    staking: async () => {
      const xastro_fee_stat = await getStakingStats();
      return xastro_fee_stat;
    },
    tokens: async () => {
      const pools = await getTokens();
      return pools;
    },
    votes: async (_: any, { proposal_id, choice, limit, offset }: any) => {
      const votes = await getVotes(proposal_id, choice, limit, offset);
      return votes;
    },
    user: async (_: any, { address }: any, ctx: any, resolveInfo: any) => {
      const user: User = {
        address,
      };

      // parseResolveInfo helps us determine which fields were requested
      // and aids in skipping long-running fields if not requested
      const resolvedInfo: any = parseResolveInfo(resolveInfo);

      if (!resolvedInfo) {
        // Unable to parse the query
        return user;
      }

      // Was voting power requested?
      if (resolvedInfo.fieldsByTypeName.User.voting_power) {
        const voting_power = await getVotingPower(address);
        user.voting_power = voting_power;
      }

      // Was tokens requested?
      if (resolvedInfo.fieldsByTypeName.User.tokens) {
        user.tokens = await getAllTokenHoldings(address);
      }

      // was pending_rewards requested?
      // to be extended with other pending rewards
      if (resolvedInfo.fieldsByTypeName.User.pending_rewards) {
        const bluna_ust_rewards = await getBlunaUstRewards(address);
        user.pending_rewards = {
          bluna_ust: bluna_ust_rewards,
        };
      }

      // Was staked_lp_tokens requested?
      if (resolvedInfo.fieldsByTypeName.User.staked_lp_tokens) {
        user.staked_lp_tokens = await getUserStakedLpTokens(address);
      }

      return user;
    },
  },
};
