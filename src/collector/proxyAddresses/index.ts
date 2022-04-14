import { BLOCKS_PER_YEAR, GENERATOR_ADDRESS } from "../../constants";
import { getContractConfig, getContractStore, getGeneratorPoolInfo } from "../../lib/terra";
import { formatSchedule, generateScheduleType } from "./helpers";
import { Schedules } from "../../types/contracts";

interface TokenInfo {
  factory: string;
  proxy: string;
  pool: string;
  token: string; //reward_token_addr
  lpToken: string; //lp_token_addr
  pending_astro_rewards: number;
  alloc_point: number;
  percentage_distribution: number;
  astro_yearly_emmissions: number;
  distribution_schedule: Schedules;
}

/**
 * Gets all proxy addresses from generator contract
 * Gets reward information. and values required to calculate apr.
 *
 * @returns a map with pairAddress -> TokenInformation
 */
export const getProxyAddressesInfo = async (): Promise<Map<string, TokenInfo>> => {
  const config = await getContractConfig(GENERATOR_ADDRESS as string);
  const totalAllocPoint = config?.total_alloc_point;
  const rewardProxyAddresses: string[] = config?.allowed_reward_proxies;
  // const vestingContract = config.vesting_contract;
  const tokensPerBlock = config?.tokens_per_block;
  const totalTokensPerYear = (tokensPerBlock * BLOCKS_PER_YEAR) / 10 ** 6;

  const proxyAddressesInfo = new Map<string, TokenInfo>();

  for (const address of rewardProxyAddresses) {
    const addressConfig = await getContractConfig(address);
    const poolInfo = await getGeneratorPoolInfo(addressConfig?.lp_token_addr);
    let rewardConfig = await getContractConfig(addressConfig?.reward_contract_addr);

    const alloc_point = parseInt(poolInfo?.alloc_point || "0");

    //in case contract has get_config and not config
    if (!rewardConfig) {
      rewardConfig = await getContractStore(
        addressConfig.reward_contract_addr,
        JSON.parse('{"get_config": { }}')
      );
    }

    const schedule = formatSchedule(rewardConfig?.distribution_schedule, rewardConfig);
    const type = generateScheduleType(schedule);
    const percentageDistribution = alloc_point / totalAllocPoint;

    const tokenInfo: TokenInfo = {
      factory: addressConfig.reward_contract_addr, //reward_contract_addr
      proxy: address, // proxy address
      pool: addressConfig.pair_addr, //pair_addr
      token: addressConfig.reward_token_addr, //reward_token_addr
      lpToken: addressConfig.lp_token_addr, //lp_token_addr
      pending_astro_rewards: parseInt(poolInfo?.pending_astro_rewards || "0"),
      alloc_point: alloc_point,
      percentage_distribution: alloc_point / totalAllocPoint,
      astro_yearly_emmissions: totalTokensPerYear * percentageDistribution,
      distribution_schedule: { values: schedule, type },
    };

    proxyAddressesInfo.set(addressConfig.pair_addr, tokenInfo);
  }

  return proxyAddressesInfo;
};
