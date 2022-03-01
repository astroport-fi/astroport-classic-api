export const typeDefs = /* GraphQL */ `
  scalar DateTime

  type Airdrop {
    amount: Float
    claimed: Boolean
    merkle_proof: [String]
    index: Int
    airdrop_series: Int
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
  
  type Staking {
    _24h_fees_ust: Float
    _24h_apr: Float
    _24h_apy: Float
    block: Float
  }
  
  type Block {
    chain_id: String
    height: Float
  }

  # The "Query" type lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    airdrop(address: String!): [Airdrop]
    block: Block
    stats: AstroportStats
    pool(address: String!): Pool
    pools: [Pool]
    price(tokenAddress: String!): Price
    supply: Supply
    staking: Staking
  }
`;
