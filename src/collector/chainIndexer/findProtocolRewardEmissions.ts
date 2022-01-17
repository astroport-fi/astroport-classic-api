import { GENERATOR_PROXY_CONTRACTS } from "../../constants";
import { createWithdrawLogFinder } from "../logFinder";
import { PoolProtocolReward } from "../../models/pool_protocol_reward.model";

export async function findProtocolRewardEmissions(
  event: any,
  height: number
): Promise<void> {

  const poolTotal = new Map<string, any>();

  for(const [key, value] of GENERATOR_PROXY_CONTRACTS.entries()) {
    const withdrawLogFinder = createWithdrawLogFinder(
      GENERATOR_PROXY_CONTRACTS,
      value.token,
      value.proxy,
      value.factory);

    const withdrawLogFound = withdrawLogFinder(event);

    if (withdrawLogFound) {
      console.log("withdraw log found" + JSON.stringify(withdrawLogFound))
      for (const found of withdrawLogFound) {
        const transformed = found.transformed

        if (transformed != null) {
          const rewardEntry = value
          rewardEntry.block = height
          if (poolTotal.has(key)) {
            rewardEntry.value = poolTotal.get(key) + transformed?.amount
            poolTotal.set(key, rewardEntry)
          } else {
            rewardEntry.value = transformed?.amount
            poolTotal.set(key, rewardEntry)
          }
        }
      }
    }
  }

  if(poolTotal.size > 0) {
    console.log("Pooltotal: " + poolTotal)
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
      volume: value.value
    })
  }
}
