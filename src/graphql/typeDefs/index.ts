import { gql } from 'apollo-server';

export const typeDefs = /* GraphQL */ `
  scalar DateTime
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Price {
    token1: Float
    token2: Float
    createdAt: DateTime
  }

  type Tvl {
    value: Float
    createdAt: DateTime
  }

  type Vault {
    apy: Float
    createdAt: DateTime
  }

  type Pair {
    contractAddress: String
    token1: String
    token2: String
    prices: [Price]
    createdAt: DateTime
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    pair(contractAddress: ID!): Pair
    tvl: [Tvl]
    vault: Vault
  }
`;
