import {
  getContractConfig,
  getContractStore,
  getGeneratorPoolInfo,
  getLatestBlock,
} from "../../../src/lib/terra";
import {
  ASSEMBLY_TREASURY,
  ASTRO_TOKEN,
  GENERATOR_ADDRESS,
  XASTRO_STAKING_ADDRESS,
} from "../../../src/constants";
import { expect } from "chai";
import fs = require("fs");
import {
  calculateThirdPartyApr,
  calculateThirdPartyAprV2,
} from "../../../src/collector/chainIndexer/calculateApr";

describe("Hive", function () {
  // it("fetches alloc points", async () => {
  //   const poolInfo = await getGeneratorPoolInfo("terra1cspx9menzglmn7xt3tcn8v8lg6gu9r50d7lnve");
  //   expect(poolInfo?.alloc_point).to.be.a("string");
  //   expect(poolInfo).to.haveOwnProperty("accumulated_rewards_per_share");
  // });

  // it("fetches contract config", async () => {
  //   const config = await getContractConfig("terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8");
  //   expect(config).to.haveOwnProperty("pair_addr");
  //   expect(config).to.haveOwnProperty("generator_contract_addr");
  // });

  // it("gets total_astro_staked from getContractStore", async () => {
  //   let total_astro_staked: any = await getContractStore(
  //     ASTRO_TOKEN,
  //     JSON.parse('{"balance": { "address": "' + XASTRO_STAKING_ADDRESS + '" }}')
  //   );
  //   total_astro_staked = total_astro_staked?.balance / 1000000;
  //   expect(total_astro_staked).to.be.a("number");
  // });

  // it("gets treasury balance from getContractStore", async () => {
  //   const treasury: any = await getContractStore(
  //     ASTRO_TOKEN,
  //     JSON.parse('{"balance": { "address": "' + ASSEMBLY_TREASURY + '" }}')
  //   );
  //   expect(+treasury?.balance).to.be.a("number");
  // });

  // it("get Latest Height", async () => {
  //   const height = (await getLatestBlock()).height;
  //   expect(height).to.be.a("number");
  // });

  it("fetches config from generator contract", async () => {
    const config = await getContractConfig(GENERATOR_ADDRESS as string);
    const rewardProxyAddresses: string[] = config.allowed_reward_proxies;

    const entries = [];
    const failedEntries = [];

    for (const address of rewardProxyAddresses) {
      const addressConfig = await getContractConfig(address);
      const poolInfo: any = await getGeneratorPoolInfo(addressConfig.lp_token_addr);
      let rewardConfig = await getContractConfig(addressConfig.reward_contract_addr);
      let dist = null;

      if (!rewardConfig) {
        rewardConfig = await getContractStore(
          addressConfig.reward_contract_addr,
          JSON.parse('{"get_config": { }}')
        );
      }

      if (!rewardConfig?.distribution_schedule) {
        //TODO temporary values for mars token
        if (rewardConfig?.mars_token) {
          dist = [[1646650800, 1678186800, "10000000000000"]];
          //TODO temporary values for mirror token
        } else if (Object.keys(rewardConfig).includes("mirror_token")) {
          dist = [
            [21600, 31557600, "20587500000000"],
            [31557600, 63093600, "10293700000000"],
            [63093600, 94629600, "5146800000000"],
            [94629600, 126165600, "2573400000000"],
          ];
        } else {
          failedEntries.push({
            reward_contract_addr: addressConfig.reward_contract_addr,
            ...rewardConfig,
          });
        }
      } else {
        const singleSchedule = rewardConfig?.distribution_schedule.find(() => true);
        if (Array.isArray(singleSchedule)) {
          dist = rewardConfig?.distribution_schedule;
        } else if (singleSchedule?.start_time) {
          dist = rewardConfig?.distribution_schedule.map((i: any) => [
            i.start_time,
            i.end_time,
            i.amount,
          ]);
        }
      }

      const rewardTokenInfo: any = {
        factory: addressConfig.reward_contract_addr, //reward_contract_addr
        proxy: address, // proxy address
        pool: addressConfig.pair_addr, //pair_addr
        token: addressConfig.reward_token_addr, //reward_token_addr
        lpToken: addressConfig.lp_token_addr, //lp_token_addr
        pending_astro_rewards: parseInt(poolInfo.pending_astro_rewards),
        alloc_point: parseInt(poolInfo.alloc_point),
        yearly_astro_emmissions: poolInfo.alloc_point * 1000,
        distribution_schedule: dist,
      };
      entries.push(rewardTokenInfo);
    }

    const total = entries.reduce((acc, entry) => acc + entry.alloc_point, 0);
    console.log("Total alloc points", total);

    await fs.writeFileSync("myjsonfile.json", JSON.stringify(entries), "utf8");
    await fs.writeFileSync("myjsonfileFailed.json", JSON.stringify(failedEntries), "utf8");
    console.log("########DONE");
  });
});
