export const typeDefs = /* GraphQL */ `
  scalar DateTime

  type Airdrop {
    amount: Float
    claimed: Boolean
    merkle_proof: [String]
    index: Int
    airdrop_series: Int
  }

  type Pair {
    contractAddr: String
    liquidityToken: String
    token1: String
    token2: String
    type: String
    prices: Price
    createdAt: DateTime
  }
  
  type Price {
    token_address: String
    price_ust: Float
    block_last_updated: Float
  }
  
  type Supply {
    circulatingSupply: Float
    priceInUst: Float
    totalValueLockedUst: Float
    dayVolumeUst: Float
  }
  
  type Fee {
    day: Float
    apr: Float
    apy: Float
  }
  
  type Pool {
    timestamp: DateTime
    pool_address: String
    lp_address: String
    trading_fee: Float
    pool_liquidity: Float
    _24hr_volume: Float
    token_symbol: String
    prices: PoolPrices
    trading_fees: Fee
    astro_rewards: Fee
    protocol_rewards: Fee
    total_rewards: Fee
  }
  
  type PoolPrices {
    token1_address: String
    token1_price_ust: Float
    token2_address: String
    token2_price_ust: Float
  }
  
  type AstroportStats {
    total_liquidity: Float
    total_volume_24h: Float
    astro_price: Float
  }

  # The "Query" type lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    airdrop(address: String!): [Airdrop]
    stats: AstroportStats
    pair(contractAddr: ID!): Pair
    pairs: [Pair]
    pool(address: String!): Pool
    pools: [Pool]
    price(tokenAddress: String!): Price
    supply: Supply
  }
`;
