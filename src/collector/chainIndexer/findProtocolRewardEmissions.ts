import { createWithdrawLogFinder } from "../logFinder";
import { PoolProtocolReward } from "../../models/pool_protocol_reward.model";
import { ProxyAddressInfo } from "../../types/contracts";

export async function findProtocolRewardEmissions(
  event: any,
  height: number,
  generatorProxyContracts: Map<string, ProxyAddressInfo>
): Promise<void> {
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
  for (const [key, value] of poolTotal) {
    try {
      await PoolProtocolReward.create({
        pool: value.pool,
        factory: value.factory,
        proxy: value.proxy,
        token: value.token,
        tokenName: value.tokenName,
        block: height,
        volume: value.value,
      });
    } catch (e) {
      console.log("Failed to create pool protocol rewards:", e);
    }
  }
}
