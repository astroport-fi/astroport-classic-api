export const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar JSON

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
    updatedAt: DateTime
  }

  type Fee {
    day: Float
    apr: Float
    apy: Float
    estimated_apr: Float
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
    pool_type: String
    reward_proxy_address: String
    alloc_point: Int
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
    height: Float
  }

  type Token {
    tokenAddr: String
    symbol: String
    icon: String
    decimals: Float
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
    updatedAt: DateTime
  }

  type Staking {
    _24h_fees_ust: Float
    _24h_apr: Float
    _24h_apy: Float
    block: Float
    updatedAt: DateTime
  }

  type Block {
    height: Float
    updatedAt: DateTime
  }

  type Token {
    tokenAddr: String
    symbol: String
    icon: String
    name: String
    decimals: Float
  }

  type Proposal {
    proposal_id: Float
    state: String
    created: DateTime
    active: DateTime
    passed: DateTime
    executed: DateTime
    rejected: DateTime
    expired: DateTime
    start_timestamp: DateTime
    end_timestamp: DateTime
    start_block: Float
    end_block: Float
    votes_for: Float
    votes_against: Float
    votes_for_power: Float
    votes_against_power: Float
    total_voting_power: Float
    title: String
    description: String
    link: String
    messages: String
    submitter: String
    submitter_tokens_submitted: Float
  }

  type Vote {
    voter: String
    proposal_id: Float
    vote: String
    voting_power: Float
    block: Float
    txn: String
  }

  type Snapshot {
    block: Float
    pool: JSON
    price: JSON
    stat: JSON
    supply: JSON
    xastro: JSON
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
    updatedAt: DateTime
  }

  type Staking {
    _24h_fees_ust: Float
    _24h_apr: Float
    _24h_apy: Float
    block: Float
    updatedAt: DateTime
  }

  type Block {
    height: Float
    updatedAt: DateTime
  }

  type Token {
    tokenAddr: String
    symbol: String
    icon: String
    name: String
    decimals: Float
  }

  type Proposal {
    proposal_id: Float
    state: String
    created: DateTime
    active: DateTime
    passed: DateTime
    executed: DateTime
    rejected: DateTime
    expired: DateTime
    start_timestamp: DateTime
    end_timestamp: DateTime
    start_block: Float
    end_block: Float
    votes_for: Float
    votes_against: Float
    votes_for_power: Float
    votes_against_power: Float
    total_voting_power: Float
    title: String
    description: String
    link: String
    messages: String
    submitter: String
    submitter_tokens_submitted: Float
  }

  type Vote {
    voter: String
    proposal_id: Float
    vote: String
    voting_power: Float
    block: Float
    txn: String
  }

  type Snapshot {
    block: Float
    pool: JSON
    price: JSON
    stat: JSON
    supply: JSON
    xastro: JSON
  }

  enum PoolSortFields {
    TVL
    APR
    VOLUME
  }

  enum SortDirections {
    DESC
    ASC
  }

  # The "Query" type lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    airdrop(address: String!): [Airdrop]
    block: Block
    stats: AstroportStats
    pool(address: String!): Pool
    pools(
      poolAddress: String
      tokenName: String
      sortField: PoolSortFields
      sortDirection: SortDirections
      offset: Int
      limit: Int
    ): [Pool]
    price(tokenAddress: String!): Price
    proposal(proposal_id: String!): Proposal
    proposals: [Proposal]
    snapshot(offset: Int, limit: Int): [Snapshot]
    supply: Supply
    staking: Staking
    tokens: [Token]
    votes(proposal_id: String!, choice: String, offset: Int, limit: Int): [Vote]
  }
`;
