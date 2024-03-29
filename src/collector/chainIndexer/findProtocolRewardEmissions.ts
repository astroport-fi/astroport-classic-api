import { createWithdrawLogFinder } from "../logFinder";
import { PoolProtocolReward } from "../../models/pool_protocol_reward.model";
import { PoolProtocolReward as PoolProtocolRewardType } from "../../types/pool_protocol_reward.type";
import { ProxyAddressInfo } from "../../types/contracts";

export async function findProtocolRewardEmissions(
  event: any,
  height: number,
  generatorProxyContracts: Map<string, ProxyAddressInfo>
): Promise<PoolProtocolRewardType[]> {
  const poolTotal = new Map<string, any>();

  for (const value of generatorProxyContracts.values()) {
    if (!value.proxy) {
      continue;
    }

    const withdrawLogFinder = createWithdrawLogFinder(
      generatorProxyContracts,
      value.token,
      value.proxy,
      value.factory
    );

    const withdrawLogFound = withdrawLogFinder(event);

    if (withdrawLogFound) {
      for (const found of withdrawLogFound) {
        const transformed = found.transformed;

        if (transformed != null) {
          const rewardEntry: any = { ...value, block: height };

          if (poolTotal.has(value.proxy)) {
            rewardEntry.value = poolTotal.get(value.proxy) + transformed?.amount;
            poolTotal.set(value.proxy, rewardEntry);
          } else {
            rewardEntry.value = transformed?.amount;
            poolTotal.set(value.proxy, rewardEntry);
          }
        }
      }
    }
  }

  // save to db
  const rewardsIndexed: PoolProtocolRewardType[] = [];
  for (const [key, value] of poolTotal) {
    try {
      const createdReward = await PoolProtocolReward.create({
        pool: value.pool,
        factory: value.factory,
        proxy: value.proxy,
        token: value.token,
        tokenName: value.tokenName,
        block: height,
        volume: value.value,
      });
      if (createdReward) {
        rewardsIndexed.push(createdReward);
      }
    } catch (e) {
      console.log("Failed to create pool protocol rewards:", e);
    }
  }
  return rewardsIndexed;
}
