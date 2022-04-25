import { getContractConfig, getContractStore, getGeneratorPoolInfo } from "../../lib/terra";
import { formatSchedules, generateScheduleType } from "./helpers";
import { ProxyAddressInfo } from "../../types/contracts";
import constants from "../../environment/constants";

enum AddressType {
  pair = "pair",
  proxy = "proxy",
}

interface RewardAddress {
  address: string;
  type: AddressType;
}

/**
 * Gets proxy addresses from generator contract.
 * adds pair contracts that receive rewards but are not in generator's reward proxy address list.
 * Gets reward information and values required to calculate both native calculate apr, and Astro Apr.
 *
 *
 * @returns a Map with pairAddress -> TokenInformation
 */
export const getProxyAddressesInfo = async (): Promise<Map<string, ProxyAddressInfo>> => {
  const generatorConfig = await getContractConfig(constants.GENERATOR_ADDRESS as string);
  const totalAllocPoint = generatorConfig?.total_alloc_point;
  const fetchedProxyAddresses: RewardAddress[] = generatorConfig?.allowed_reward_proxies.map(
    (i: any) => ({
      address: i,
      type: AddressType.proxy,
    })
  );

  const rewardAddresses: RewardAddress[] = [
    ...fetchedProxyAddresses,
    // adding pair addresses that receive astro rewards
    // these are not in allowed_reward_proxies
    { address: constants.BLUNA_LUNA_PAIR, type: AddressType.pair },
    { address: constants.ASTRO_UST_PAIR, type: AddressType.pair },
    { address: constants.LUNA_UST_PAIR, type: AddressType.pair },
  ];

  const tokensPerBlock = generatorConfig?.tokens_per_block;
  const totalTokensPerYear = (tokensPerBlock * constants.BLOCKS_PER_YEAR) / 10 ** 6;
  const proxyAddressesInfo = new Map<string, ProxyAddressInfo>();

  await Promise.all(
    rewardAddresses.map(async (item) => {
      let addressConfig: any;
      let lpTokenAddr;
      let rewardContractAddr;
      let pairAddress;
      let proxyAddress;

      try {
        if (item.type === AddressType.proxy) {
          addressConfig = await getContractConfig(item.address);
          lpTokenAddr = addressConfig?.lp_token_addr;
          rewardContractAddr = addressConfig?.reward_contract_addr;
          pairAddress = addressConfig?.pair_addr;
          proxyAddress = item.address;
        } else if (item.type === AddressType.pair) {
          addressConfig = await getContractStore(item.address, JSON.parse('{"pair": { }}'));
          lpTokenAddr = addressConfig?.liquidity_token;
          pairAddress = item.address;
        }
      } catch (e) {
        console.log("failed fetching address info");
      }

      const poolInfo = await getGeneratorPoolInfo(lpTokenAddr);

      let rewardConfig = rewardContractAddr
        ? await getContractConfig(addressConfig?.reward_contract_addr)
        : null;

      //in case contract has get_config and not config
      if (!rewardConfig && rewardContractAddr) {
        rewardConfig = await getContractStore(
          rewardContractAddr,
          JSON.parse('{"get_config": { }}')
        );
      }

      const alloc_point = parseInt(poolInfo?.alloc_point || "0");
      const schedule = formatSchedules(rewardConfig?.distribution_schedule, rewardConfig);
      const type = generateScheduleType(schedule);

      const percentageDistribution = alloc_point / totalAllocPoint;

      const tokenInfo: ProxyAddressInfo = {
        factory: addressConfig?.reward_contract_addr, //reward_contract_addr
        proxy: proxyAddress, // proxy address
        pool: pairAddress, //pair_addr
        token: addressConfig?.reward_token_addr, //reward_token_addr
        lpToken: lpTokenAddr, //lp_token_addr
        pending_astro_rewards: parseInt(poolInfo?.pending_astro_rewards || "0"),
        alloc_point: alloc_point,
        percentage_distribution: percentageDistribution,
        astro_yearly_emissions: totalTokensPerYear * percentageDistribution,
        distribution_schedule: { values: schedule, type },
      };

      //mostly for testnet check, one address in testnet has no information;
      if (pairAddress) {
        proxyAddressesInfo.set(pairAddress, tokenInfo);
      }
    })
  );

  return proxyAddressesInfo;
};
