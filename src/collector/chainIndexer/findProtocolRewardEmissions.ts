import { createWithdrawLogFinder } from "../logFinder";
import { PoolProtocolReward } from "../../models/pool_protocol_reward.model";
import { GENERATOR_PROXY_CONTRACTS } from "../../constants";

export async function findProtocolRewardEmissions(event: any, height: number): Promise<void> {
  const poolTotal = new Map<string, any>();

  for (const value of GENERATOR_PROXY_CONTRACTS.values()) {
    const withdrawLogFinder = createWithdrawLogFinder(
      GENERATOR_PROXY_CONTRACTS,
      value.token,
      value.proxy,
      value.factory
    );

    const withdrawLogFound = withdrawLogFinder(event);

    if (withdrawLogFound) {
      for (const found of withdrawLogFound) {
        const transformed = found.transformed;

        if (transformed != null) {
          const rewardEntry = value;
          rewardEntry.block = height;
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
    await PoolProtocolReward.create({
      pool: value.pool,
      factory: value.factory,
      proxy: value.proxy,
      token: value.token,
      tokenName: value.tokenName,
      block: height,
      volume: value.value,
    });
  }
}
