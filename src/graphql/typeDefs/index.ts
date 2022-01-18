export const typeDefs = /* GraphQL */ `
  scalar DateTime

  type Price {
    token1: Float
    token2: Float
    createdAt: DateTime
  }

  type Airdrop {
    amount: Float
    claimed: Boolean
    merkle_proof: [String]
    index: Int
    airdrop_series: Int
  }

  type Token {
    tokenAddr: String
    symbol: String
    icon: String
    decimals: Int
    createdAt: DateTime
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
    trading_fee: Float
    pool_liquidity: Float
    _24hr_volume: Float
    trading_fees: Fee
    astro_rewards: Fee
    protocol_rewards: Fee
    total_rewards: Fee
  }

  # The "Query" type lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    airdrop(address: String!): [Airdrop]
    pair(contractAddr: ID!): Pair
    pairs: [Pair]
    pools: [Pool]
    supply: Supply
    tokens: [Token]
  }
`;
