import { initLCD, lcd } from "../lib/terra";
import {
  getBuilderAllocationForWallet,
  getCW20TokenHoldings,
  getTokenHolding,
  getvxAstroVotingPower,
  initHive,
  getStakedBalances,
  getContractConfig,
  getContractStore,
  getLockDropRewards,
} from "../lib/terra/hive";
import { isIBCToken, isNative } from "../modules/terra";
import { PairType, UserLpToken } from "../types/user_lp.type";
import { UserTokenHolding } from "../types/user_token_holding.type";
import { VotingPower } from "../types/voting_power.type";
import { getPairs } from "./pair.service";
import { getPriceByTokenAddress } from "./priceV2.service";
import { getToken, getTokens } from "./token.service";
import { BlunaPendingRewards, LockUpInfoList } from "../types/user.type";
import constants from "../environment/constants";

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
  initHive(constants.TERRA_HIVE_ENDPOINT);

  // Voting power from xAstro holdings
  const xAstroBalance = await getTokenHolding(constants.XASTRO_TOKEN, address);

  // Voting power from builder unlock
  const builderAllocation = await getBuilderAllocationForWallet(constants.BUILDER_UNLOCK, address);

  let builderTotal = 0;
  if (builderAllocation) {
    const totalAllocated = +builderAllocation.params.amount;
    const totalWithdrawn = +builderAllocation.status.astro_withdrawn;
    builderTotal = totalAllocated - totalWithdrawn;
  }

  // Voting power from vxAstro holdings
  let vxAstroVotingPower = 0;
  if (constants.VXASTRO_TOKEN) {
    // When vxAstro launches, we just need to define the contract address
    vxAstroVotingPower = await getvxAstroVotingPower(constants.VXASTRO_TOKEN, address);
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
  initHive(constants.TERRA_HIVE_ENDPOINT);
  initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

  const userTokens: UserTokenHolding[] = [];

  // Get native and IBC token balances for address
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
  for (const [address, holding] of holdings) {
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

/**
 * Takes an array and turns it into smaller chunks.
 * [1, 2, 3, 4] => [[1,2], [3,4]]
 *
 * @param arr array to be split
 * @param chunkSize how many chunks to split into
 * @returns chunked array.
 */
function sliceIntoChunks<T = any>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

/**
 * Get all user staked lp tokens information
 * includes each token in the pool, pool address, pool type and pool fees.
 *
 * @param address The wallet address to retrieve staked lp tokens
 * @returns information about staked tokens.
 */
export const getUserStakedLpTokens = async (address: string): Promise<UserLpToken[]> => {
  //TODO reuse connection between requests
  await initHive(constants.TERRA_HIVE_ENDPOINT);
  const factoryConfig = await getContractConfig(constants.FACTORY_ADDRESS);
  const pairs = await getPairs();

  const pairLpTokens: { liquidityToken: string }[] = pairs.map(({ liquidityToken }) => ({
    liquidityToken,
  }));
  //chunk into smaller arrays to avoid hive limits in one query
  const addressesChunks = sliceIntoChunks<{ liquidityToken: string }>(pairLpTokens, 50);

  const stakedBalances: { [key: string]: any }[] = (
    await Promise.all(
      addressesChunks.map(async (chunk) => {
        return await getStakedBalances(chunk, address, constants.GENERATOR_ADDRESS);
      })
    )
  ).reduce((accumulator, items) => ({ ...accumulator, ...items }));

  // filter where staked > 0;
  const userStakedLpInfo = Object.entries(stakedBalances).filter(([_, item]) => {
    return +(item?.contractQuery || "0") > 0;
  });

  const response = userStakedLpInfo.map(([lpToken, lpInfo]) => {
    const pairInfo = pairs.find((i) => i.liquidityToken === lpToken);
    const { token1, token2, contractAddr, type } = pairInfo;

    const pairConfig: PairType = factoryConfig?.pair_configs?.find((item: any) => {
      const pairTypeKey = Object.keys(item?.pair_type).find(() => true);
      const pairType = pairTypeKey !== "custom" ? pairTypeKey : item?.pair_type?.custom;
      return pairType === type;
    });

    return {
      token1,
      token2,
      lp_token_address: lpToken,
      pool_address: contractAddr,
      pool_type: type,
      pool_fees: pairConfig?.total_fee_bps / 100,
      staked_balance: lpInfo.contractQuery,
    };
  });
  return response;
};

/**
 * Gets bluna UST rewards that can be claimed by both lockdrop participants and by normal LPs
 *
 * Voting power is calculated as follows:
 * voting power = token allocation (in builder unlock) - astro withdrawn (from builder unlock) + current xAstro holding
 *
 *
 * @param address user wallet addres
 * @returns Pending rewards ust
 */
export const getBlunaUstRewards = async (address: string): Promise<number> => {
  //TODO reuse connection between requests
  await initHive(constants.TERRA_HIVE_ENDPOINT);
  const bLunaRewardsResponse: BlunaPendingRewards | null = await getContractStore(
    constants.BLUNA_PAIR_CONTRACT,
    JSON.parse(`{"pending_reward": { "user": "${address}" }}`)
  );
  const bLunaPendingRewards = bLunaRewardsResponse?.amount || "0";

  //check lockupList for bluna terraswap pool_address
  const lockUpList: LockUpInfoList | null = await getContractStore(
    constants.LOCKDROP_CONTRACT,
    JSON.parse(`{"user_info_with_lockups_list": { "address": "${address}" }}`)
  );

  let lockUpDuration = undefined;
  if (lockUpList) {
    for (const item of lockUpList.lockup_infos) {
      if (item.pool_address === constants.BLUNA_TERRASWAP_LP_CONTRACT) {
        lockUpDuration = item.duration;
        break;
      }
    }
  }

  let blunaLockdropRewards = 0;
  if (lockUpDuration) {
    const response = await getLockDropRewards({
      userAddress: address,
      lockDropContract: constants.LOCKDROP_CONTRACT,
      blunaTerraswapLp: constants.BLUNA_TERRASWAP_LP_CONTRACT,
      duration: lockUpDuration,
    });
    // console.log(response);
    blunaLockdropRewards = response;
  }

  return parseInt(bLunaPendingRewards) + blunaLockdropRewards;
};
