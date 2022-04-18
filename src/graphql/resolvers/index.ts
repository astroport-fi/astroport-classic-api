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
import { getVotingPower } from "../../services/user.service";
import { User } from "../../types/user.type";
import { parseResolveInfo } from "../../lib/graphql-parse-resolve-info";
import { getTokenHoldings, initHive, initLCD, lcd } from "../../lib/terra";
import { isIBCToken, isNative } from "../../modules/terra";
import { UserTokenHolding } from "../../types/user_token_holding.type";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD } from "../../constants";

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
      const userTokens: UserTokenHolding[] = [];
      if (resolvedInfo.fieldsByTypeName.User.tokens) {
        initHive(TERRA_HIVE);
        initLCD(TERRA_LCD, TERRA_CHAIN_ID);

        // Get native token balances for address (includes IBC tokens)
        const [balance] = await lcd.bank.balance(address);
        if (balance) {
          for (const coin of balance.toData()) {
            // Get the token price, if no price is available in UST, we
            // assume 0
            let tokenPrice = 0.0;
            const price = await getPriceByTokenAddress(coin.denom);
            if (price) {
              tokenPrice = price.price_ust;
            }

            // Only add it to the list if we have metadata for the token
            const token = await getToken(coin.denom);
            if (token) {
              const amount = +coin.amount / 10 ** 6; // 6 decimals for native tokens
              userTokens.push({
                token,
                amount,
                valueUST: tokenPrice * amount,
              });
            }
          }
        }

        // Get all tokens we have indexed which is any token a pair was created for
        const capturedTokens = await getTokens();

        // Extract CW20 token addresses from list
        const cw20Tokens = capturedTokens
          .filter((token) => {
            // Filter out native and IBC as they're already fetched
            if (isNative(token.tokenAddr)) return false;
            if (isIBCToken(token.tokenAddr)) return false;
            return true;
          })
          .map((token) => token.tokenAddr);

        const holdings = await getTokenHoldings(cw20Tokens, address);
        for (let [address, holding] of holdings) {
          const token = capturedTokens.find((token) => token.tokenAddr === address);
          if (holding > 0) {
            let tokenPrice = 0.0;
            const price = await getPriceByTokenAddress(token.tokenAddr);
            if (price) {
              tokenPrice = price.price_ust;
            }

            const amount = holding / 10 ** token.decimals;
            userTokens.push({
              token,
              amount,
              valueUST: amount * tokenPrice,
            });
          }
        }
        user.tokens = userTokens;
      }

      return user;
    },
  },
};
