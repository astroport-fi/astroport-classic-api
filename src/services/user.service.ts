import {
  BLUNA_PAIR_CONTRACT,
  BLUNA_TERRASWAP_LP_CONTRACT,
  BUILDER_UNLOCK,
  LOCKDROP_CONTRACT,
  TERRA_HIVE,
  VXASTRO_TOKEN,
  XASTRO_TOKEN,
} from "../constants";
import {
  getBuilderAllocationForWallet,
  getTokenHolding,
  getvxAstroVotingPower,
  initHive,
  getLockDropRewards,
  getContractStore,
} from "../lib/terra";
import { BlunaPendingRewards, LockUpInfoList } from "../types/user.type";
import { VotingPower } from "../types/voting_power.type";

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
  const bLunaRewardsResponse: BlunaPendingRewards | null = await getContractStore(
    BLUNA_PAIR_CONTRACT,
    JSON.parse(`{"pending_reward": { "user": "${address}" }}`)
  );
  const bLunaPendingRewards = bLunaRewardsResponse?.amount || "0";

  //check lockupList for bluna terraswap pool_address
  const lockUpList: LockUpInfoList | null = await getContractStore(
    LOCKDROP_CONTRACT,
    JSON.parse(`{"user_info_with_lockups_list": { "address": "${address}" }}`)
  );

  let lockUpDuration = undefined;
  if (lockUpList) {
    for (const item of lockUpList.lockup_infos) {
      if (item.pool_address === BLUNA_TERRASWAP_LP_CONTRACT) {
        lockUpDuration = item.duration;
        break;
      }
    }
  }

  let blunLockdropRewards = 0;
  if (lockUpDuration) {
    const response = await getLockDropRewards({
      userAddress: address,
      lockDropContract: LOCKDROP_CONTRACT,
      blunaTerraswapLp: BLUNA_TERRASWAP_LP_CONTRACT,
      duration: lockUpDuration,
    });
    console.log(response);
    blunLockdropRewards = response;
  }

  return parseInt(bLunaPendingRewards) + blunLockdropRewards;
};
