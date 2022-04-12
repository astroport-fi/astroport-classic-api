import { BUILDER_UNLOCK, TERRA_HIVE, VXASTRO_TOKEN, XASTRO_TOKEN } from "../constants";
import {
  getBuilderAllocationForWallet,
  getTokenHolding,
  getvxAstroVotingPower,
  initHive,
} from "../lib/terra/hive";
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
