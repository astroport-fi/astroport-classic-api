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
    proofs: [String]
    createdAt: DateTime
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
    prices: [Price]
    createdAt: DateTime
  }
  
  type Supply {
    circulatingSupply: Int
    priceInUst: Int
    totalValueLockedUst: Int
    dayVolumeUst: Int
  }

  # The "Query" type lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    pair(contractAddr: ID!): Pair
    pairs: [Pair]
    supply: Supply
    tokens: [Token]
  }
`;
