import { Pool } from "../models/pool.model";
import {
  Pool as PoolType,
  PoolSortFields,
  SortDirections,
  fieldsObj,
  GetPools,
} from "../types/pool.type";
import { TOKEN_ADDRESS_MAP } from "../constants";

export async function getPool(address: string): Promise<any> {
  const pool = await Pool.findOne({ "metadata.pool_address": address });
  return transformPoolModelToPoolType(pool);
}

export async function getPools({
  tokenName,
  poolAddress,
  limit = 50,
  offset = 0,
  sortField = PoolSortFields.VOLUME,
  sortDirection = SortDirections.DESC,
}: GetPools): Promise<PoolType[]> {
  const filter = {
    ...(poolAddress && { "metadata.pool_address": poolAddress }),
    ...(tokenName && { "metadata.token_symbol": tokenName }),
  };

  const direction = sortDirection === SortDirections.DESC ? "-" : "";
  const sort = `${direction}${fieldsObj[sortField]}`;

  const pools = await Pool.find(filter, null, {
    limit,
    skip: offset,
    sort,
  });

  const result = pools.map((pool) => transformPoolModelToPoolType(pool));
  return result;
}

export function transformPoolModelToPoolType(model: any): PoolType {
  // TODO remove
  const symbol = TOKEN_ADDRESS_MAP.get(model.metadata.pool_address);

  return {
    timestamp: model.timestamp,
    pool_address: model.metadata.pool_address,
    lp_address: model.metadata.lp_address,
    trading_fee: model.metadata.trading_fee_rate_bp,
    pool_liquidity: model.metadata.pool_liquidity,
    pool_type: model.metadata.pool_type,
    reward_proxy_address: model.metadata.reward_proxy_address,
    alloc_point: model.metadata.alloc_point,
    _24hr_volume: model.metadata.day_volume_ust,
    prices: {
      token1_address: model.metadata.prices.token1_address,
      token1_price_ust: model.metadata.prices.token1_price_ust,
      token2_address: model.metadata.prices.token2_address,
      token2_price_ust: model.metadata.prices.token2_price_ust,
    },
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
      estimated_apr: model.metadata.fees.native.estimated_apr,
    },
    total_rewards: {
      day: model.metadata.fees.total.day,
      apr: model.metadata.fees.total.apr,
      apy: model.metadata.fees.total.apy,
    },
  };
}
