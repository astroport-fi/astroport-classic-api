import {
  BUILDER_UNLOCK,
  TERRA_CHAIN_ID,
  TERRA_HIVE,
  TERRA_LCD,
  VXASTRO_TOKEN,
  XASTRO_TOKEN,
} from "../constants";
import { initLCD, lcd } from "../lib/terra";
import {
  getBuilderAllocationForWallet,
  getCW20TokenHoldings,
  getTokenHolding,
  getvxAstroVotingPower,
  initHive,
} from "../lib/terra/hive";
import { isIBCToken, isNative } from "../modules/terra";
import { UserTokenHolding } from "../types/user_token_holding.type";
import { VotingPower } from "../types/voting_power.type";
import { getPriceByTokenAddress } from "./priceV2.service";
import { getToken, getTokens } from "./token.service";

/**
 * Calculate this wallet's voting power at this moment
 *
 * Voting power is calculated as follows:
 * voting power = token allocation (in builder unlock) - astro withdrawn (from builder unlock) + current xAstro holding
 *
 * // TODO When vxAstro launches, we need to add the vxAstro holdings calculation as well
 *
 * @param address The wallet address to calculate voting power for
 * @returns The voting power of the wallet
 */
export async function getVotingPower(address: string): Promise<VotingPower> {
  initHive(TERRA_HIVE);

  // Voting power from xAstro holdings
  const xAstroBalance = await getTokenHolding(XASTRO_TOKEN, address);

  // Voting power from builder unlock
  const builderAllocation = await getBuilderAllocationForWallet(BUILDER_UNLOCK, address);

  let builderTotal: number = 0;
  if (builderAllocation) {
    const totalAllocated = +builderAllocation.params.amount;
    const totalWithdrawn = +builderAllocation.status.astro_withdrawn;
    builderTotal = totalAllocated - totalWithdrawn;
  }

  // Voting power from vxAstro holdings
  let vxAstroVotingPower: number = 0;
  if (VXASTRO_TOKEN) {
    // When vxAstro launches, we just need to define the contract address
    vxAstroVotingPower = await getvxAstroVotingPower(VXASTRO_TOKEN, address);
  }

  const votingPower: VotingPower = {
    from_xastro: xAstroBalance,
    from_builder: builderTotal,
    from_vxastro: vxAstroVotingPower,
    total: xAstroBalance + builderTotal + vxAstroVotingPower,
  };

  return votingPower;
}

/**
 * Get all tokens held by the given address, including native, IBC and CW20. The
 * result includes token metadata as well as the USD value of the holdings where
 * possible.
 *
 * @param address The wallet address to retrieve tokens for
 * @returns The holdings of address
 */
export async function getAllTokenHoldings(address: string): Promise<UserTokenHolding[]> {
  initHive(TERRA_HIVE);
  initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  const userTokens: UserTokenHolding[] = [];

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

  const holdings = await getCW20TokenHoldings(cw20Tokens, address);
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
  return userTokens;
}
