import { BLOCKS_PER_YEAR, GENERATOR_ADDRESS } from "../../constants";
import { getContractConfig, getContractStore, getGeneratorPoolInfo } from "../../lib/terra";
import { formatSchedules, generateScheduleType } from "./helpers";
import { ProxyAddressInfo } from "../../types/contracts";

/**
 * Gets all proxy addresses from generator contract
 * Gets reward information. and values required to calculate apr.
 *
 * @returns a Map with pairAddress -> TokenInformation
 */
export const getProxyAddressesInfo = async (): Promise<Map<string, ProxyAddressInfo>> => {
  const generatorConfig = await getContractConfig(GENERATOR_ADDRESS as string);
  const totalAllocPoint = generatorConfig?.total_alloc_point;
  const rewardProxyAddresses: string[] = generatorConfig?.allowed_reward_proxies;
  const tokensPerBlock = generatorConfig?.tokens_per_block;
  const totalTokensPerYear = (tokensPerBlock * BLOCKS_PER_YEAR) / 10 ** 6;
  const proxyAddressesInfo = new Map<string, ProxyAddressInfo>();

  await Promise.all(
    rewardProxyAddresses.map(async (address) => {
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

      const schedule = formatSchedules(rewardConfig?.distribution_schedule, rewardConfig);
      const type = generateScheduleType(schedule);
      const percentageDistribution = alloc_point / totalAllocPoint;

      const tokenInfo: ProxyAddressInfo = {
        factory: addressConfig.reward_contract_addr, //reward_contract_addr
        proxy: address, // proxy address
        pool: addressConfig.pair_addr, //pair_addr
        token: addressConfig.reward_token_addr, //reward_token_addr
        lpToken: addressConfig.lp_token_addr, //lp_token_addr
        pending_astro_rewards: parseInt(poolInfo?.pending_astro_rewards || "0"),
        alloc_point: alloc_point,
        percentage_distribution: percentageDistribution,
        astro_yearly_emissions: totalTokensPerYear * percentageDistribution,
        distribution_schedule: { values: schedule, type },
      };

      proxyAddressesInfo.set(addressConfig.pair_addr, tokenInfo);
    })
  );

  return proxyAddressesInfo;
};
