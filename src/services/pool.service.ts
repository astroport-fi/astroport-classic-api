import { Pool } from "../models/pool.model";
import { Pool as PoolType } from "../types/pool.type"
import { TOKEN_ADDRESS_MAP } from "../constants";



export async function getPool(address: string): Promise<any> {
  const pool = await Pool.findOne({ "metadata.pool_address": address })
  return transformPoolModelToPoolType(pool)
}

// TODO add filtering
export async function getPools(): Promise<any[]> {
  const pools = await Pool.find({}, null, {limit: 100})
  const result = []

  // map
  for(const pool of pools) {
    result.push(transformPoolModelToPoolType(pool))
  }

  return result
}

function transformPoolModelToPoolType(model: any): PoolType {

  // TODO remove
  const symbol = TOKEN_ADDRESS_MAP.get(model.metadata.pool_address)
  
  return {
    timestamp: model.timestamp,
    pool_address: model.metadata.pool_address,
    trading_fee: model.metadata.trading_fee_rate_bp,
    pool_liquidity: model.metadata.pool_liquidity,
    _24hr_volume: model.metadata.day_volume_ust,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    token_symbol: symbol,
    trading_fees: {
      day: model.metadata.fees.trading.day,
      apr: model.metadata.fees.trading.apr,
      apy: model.metadata.fees.trading.apy,
    },
    astro_rewards: {
      day: model.metadata.fees.astro.day,
      apr: model.metadata.fees.astro.apr,
      apy: model.metadata.fees.astro.apy,
    },
    protocol_rewards: {
      day: model.metadata.fees.native.day,
      apr: model.metadata.fees.native.apr,
      apy: model.metadata.fees.native.apy,
    },
    total_rewards: {
      day: model.metadata.fees.total.day,
      apr: model.metadata.fees.total.apr,
      apy: model.metadata.fees.total.apy,
    }
  }
}